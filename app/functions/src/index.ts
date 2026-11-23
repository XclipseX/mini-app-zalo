import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { handle, HttpError, str } from "./http";
import { verifyAccessToken, getPhoneNumber } from "./zalo";
import { makeMemberQr, verifyMemberQr } from "./qr";

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: "asia-southeast1" });

const ZALO_APP_SECRET = defineSecret("ZALO_APP_SECRET");
const QR_SECRET = defineSecret("QR_SECRET");
const opts = { cors: true, secrets: [ZALO_APP_SECRET, QR_SECRET] };

const pad = (n: number) => String(n).padStart(2, "0");
// Định dạng ngày theo giờ VN (UTC+7)
const vn = (d: Date) => new Date(d.getTime() + 7 * 3600 * 1000);
const ddmmyyyy = (d: Date) => { const v = vn(d); return `${pad(v.getUTCDate())}/${pad(v.getUTCMonth() + 1)}/${v.getUTCFullYear()}`; };
const ddmm = (d: Date) => { const v = vn(d); return `${pad(v.getUTCDate())}/${pad(v.getUTCMonth() + 1)}`; };

async function auth(body: any) {
  return verifyAccessToken(str(body.accessToken, "accessToken"), ZALO_APP_SECRET.value());
}

// Kiểm tra người gọi là nhân viên đang hoạt động
async function requireStaff(body: any) {
  const u = await auth(body);
  const s = await db.doc(`staff/${u.id}`).get();
  if (!s.exists || s.get("active") !== true) throw new HttpError(403, "Không phải nhân viên");
  return { id: u.id, storeId: String(s.get("storeId") || ""), name: String(s.get("name") || "") };
}

// 1. Xác thực + tạo/cập nhật thành viên
export const verifyUser = onRequest(opts, handle(async (body) => {
  const u = await auth(body);
  const ref = db.doc(`members/${u.id}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = FieldValue.serverTimestamp();
    if (!snap.exists) tx.set(ref, { name: u.name, stamps: 0, totalStamps: 0, createdAt: now, updatedAt: now });
    else tx.update(ref, { name: u.name, updatedAt: now });
  });
  return { id: u.id, name: u.name };
}));

// 2. Lấy số điện thoại
export const resolvePhone = onRequest(opts, handle(async (body) => {
  const u = await auth(body);
  const phone = await getPhoneNumber(body.accessToken, str(body.phoneToken, "phoneToken"), ZALO_APP_SECRET.value());
  await db.doc(`members/${u.id}`).set({ phone, name: u.name, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { phone };
}));

// 3. Thông tin thành viên
export const getMember = onRequest(opts, handle(async (body) => {
  const u = await auth(body);
  const ref = db.doc(`members/${u.id}`);
  const [m, vs, hs] = await Promise.all([
    ref.get(),
    ref.collection("vouchers").where("used", "==", false).get(),
    ref.collection("history").orderBy("at", "desc").limit(20).get(),
  ]);
  const now = Date.now();
  const vouchers = vs.docs
    .map((d) => ({ id: d.id, ...d.data() } as any))
    .filter((v) => v.expiresAt && v.expiresAt.toMillis() > now)
    .sort((a, b) => a.expiresAt.toMillis() - b.expiresAt.toMillis())
    .map((v) => ({ id: v.id, title: v.title, badge: v.badge, expires: ddmmyyyy(v.expiresAt.toDate()) }));
  const history = hs.docs.map((d) => ({ text: d.get("text"), date: d.get("at") ? ddmm(d.get("at").toDate()) : "" }));
  return { stamps: m.exists ? m.get("stamps") || 0 : 0, vouchers, history, qr: makeMemberQr(u.id, QR_SECRET.value()) };
}));

// 4. Tạo đơn hàng (giá tính lại ở server)
export const createOrder = onRequest(opts, handle(async (body) => {
  const u = await auth(body);
  const storeId = str(body.storeId, "storeId");
  const items = body.items;
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) throw new HttpError(400, "Giỏ hàng không hợp lệ");
  const store = await db.doc(`stores/${storeId}`).get();
  if (!store.exists) throw new HttpError(400, "Cửa hàng không tồn tại");

  const ids = [...new Set(items.map((i: any) => String(i?.productId || "")))];
  if (ids.some((x) => !x)) throw new HttpError(400, "Thiếu productId");
  const snaps = await db.getAll(...ids.map((x) => db.doc(`products/${x}`)));
  const products = new Map(snaps.filter((s) => s.exists).map((s) => [s.id, s.data() as any]));

  let total = 0;
  const lines = items.map((it: any) => {
    const p = products.get(String(it.productId));
    if (!p || p.active === false) throw new HttpError(400, `Sản phẩm không tồn tại: ${it.productId}`);
    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new HttpError(400, "Số lượng phải từ 1 đến 20");
    const opts: Record<string, string> = {};
    let unit = Number(p.price) || 0;
    const sel = it.options && typeof it.options === "object" ? it.options : {};
    for (const [gid, oid] of Object.entries(sel)) {
      const g = (p.optionGroups || []).find((x: any) => x.id === gid);
      const o = g?.options?.find((x: any) => x.id === oid);
      if (!o) throw new HttpError(400, `Tuỳ chọn không hợp lệ: ${gid}=${oid}`);
      unit += Number(o.price) || 0;
      opts[gid] = String(oid);
    }
    total += unit * qty;
    return { productId: String(it.productId), name: p.name, qty, options: opts, unitPrice: unit, note: String(it.note || "").slice(0, 200) };
  });

  const memberRef = db.doc(`members/${u.id}`);
  let phone: string | null = null;
  if (typeof body.phoneToken === "string" && body.phoneToken) {
    phone = await getPhoneNumber(body.accessToken, body.phoneToken, ZALO_APP_SECRET.value());
    await memberRef.set({ phone, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  } else {
    phone = ((await memberRef.get()).get("phone") as string) || null;
  }

  const v = vn(new Date());
  const ymd = `${String(v.getUTCFullYear()).slice(2)}${pad(v.getUTCMonth() + 1)}${pad(v.getUTCDate())}`;
  const data = { zaloId: u.id, name: u.name, phone, storeId, items: lines, total, status: "pending", paymentMethod: "pay_at_store", createdAt: FieldValue.serverTimestamp() };
  // Thử vài lần nếu trùng mã
  for (let i = 0; i < 5; i++) {
    const orderId = `NIEN-${ymd}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    try {
      await db.doc(`orders/${orderId}`).create(data);
      // TODO: tích hợp Checkout SDK - tạo mac (HMAC) cho thanh toán online
      return { orderId, total };
    } catch (e: any) {
      if (e?.code !== 6) throw e; // 6 = ALREADY_EXISTS
    }
  }
  throw new HttpError(500, "Không tạo được mã đơn");
}));

// 5. Nhân viên cộng tem
export const addStamp = onRequest(opts, handle(async (body) => {
  const staff = await requireStaff(body);
  const memberId = verifyMemberQr(str(body.qr, "qr"), QR_SECRET.value());
  const count = body.count === undefined ? 1 : Number(body.count);
  if (!Number.isInteger(count) || count < 1 || count > 5) throw new HttpError(400, "Số tem phải từ 1 đến 5");
  const store = staff.storeId ? await db.doc(`stores/${staff.storeId}`).get() : null;
  const storeName = (store?.get("name") as string) || "cửa hàng";
  const ref = db.doc(`members/${memberId}`);

  return db.runTransaction(async (tx) => {
    const m = await tx.get(ref);
    if (!m.exists) throw new HttpError(400, "Thành viên không tồn tại");
    let stamps = (m.get("stamps") || 0) + count;
    let newVouchers = 0;
    const now = Timestamp.now();
    tx.set(ref.collection("history").doc(), { text: `+${count} tem · ${storeName}`, delta: count, storeId: staff.storeId, staffId: staff.id, at: now });
    while (stamps >= 10) {
      stamps -= 10;
      newVouchers++;
      tx.set(ref.collection("vouchers").doc(), {
        title: "1 ly miễn phí", badge: "FREE", used: false, createdAt: now,
        expiresAt: Timestamp.fromMillis(now.toMillis() + 30 * 86400 * 1000),
      });
    }
    tx.update(ref, { stamps, totalStamps: FieldValue.increment(count), updatedAt: now });
    return { stamps, newVouchers };
  });
}));

// 6. Nhân viên dùng voucher cho khách
export const redeemVoucher = onRequest(opts, handle(async (body) => {
  const staff = await requireStaff(body);
  const memberId = verifyMemberQr(str(body.qr, "qr"), QR_SECRET.value());
  const vref = db.doc(`members/${memberId}/vouchers/${str(body.voucherId, "voucherId")}`);
  return db.runTransaction(async (tx) => {
    const v = await tx.get(vref);
    if (!v.exists) throw new HttpError(400, "Voucher không tồn tại");
    if (v.get("used")) throw new HttpError(400, "Voucher đã được dùng");
    const exp = v.get("expiresAt") as Timestamp | undefined;
    if (exp && exp.toMillis() < Date.now()) throw new HttpError(400, "Voucher đã hết hạn");
    const now = Timestamp.now();
    tx.update(vref, { used: true, usedAt: now, usedBy: staff.id, usedStoreId: staff.storeId });
    tx.set(db.collection(`members/${memberId}/history`).doc(), { text: `Dùng voucher: ${v.get("title")}`, delta: 0, storeId: staff.storeId, staffId: staff.id, at: now });
    return { ok: true, voucherId: v.id };
  });
}));
