import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { handle, HttpError, str } from "./http";
import { verifyAccessToken, getPhoneNumber } from "./zalo";
import { makeMemberQr, verifyMemberQr } from "./qr";
import { buildCheckout, verifyCallback, PayMethod } from "./checkout";

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: "asia-southeast1" });

const ZALO_APP_SECRET = defineSecret("ZALO_APP_SECRET");
const QR_SECRET = defineSecret("QR_SECRET");
const CHECKOUT_PRIVATE_KEY = defineSecret("CHECKOUT_PRIVATE_KEY");
// "true" khi đang test bằng phương thức *_SANDBOX của Checkout SDK
const CHECKOUT_SANDBOX = process.env.CHECKOUT_SANDBOX !== "false";
const opts = { cors: true, secrets: [ZALO_APP_SECRET, QR_SECRET] };
const orderOpts = { cors: true, secrets: [ZALO_APP_SECRET, CHECKOUT_PRIVATE_KEY] };

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

// Đọc tem + voucher còn hạn + lịch sử của một thành viên
async function readMember(memberId: string) {
  const ref = db.doc(`members/${memberId}`);
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
  return { exists: m.exists, name: (m.get("name") as string) || "", stamps: m.exists ? m.get("stamps") || 0 : 0, vouchers, history };
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
  const { stamps, vouchers, history } = await readMember(u.id);
  return { stamps, vouchers, history, qr: makeMemberQr(u.id, QR_SECRET.value()) };
}));

// 4. Tạo đơn hàng (giá tính lại ở server)
export const createOrder = onRequest(orderOpts, handle(async (body) => {
  const u = await auth(body);
  const method: PayMethod = body.method === "BANK" ? "BANK" : "COD";
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
  const data = { zaloId: u.id, name: u.name, phone, storeId, items: lines, total, status: "pending", paymentMethod: method, paymentStatus: "unpaid", createdAt: FieldValue.serverTimestamp() };
  // Thử vài lần nếu trùng mã
  for (let i = 0; i < 5; i++) {
    const orderId = `NIEN-${ymd}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    try {
      await db.doc(`orders/${orderId}`).create(data);
      const checkout = buildCheckout({ orderId, storeId, total, method, sandbox: CHECKOUT_SANDBOX, items: lines }, CHECKOUT_PRIVATE_KEY.value());
      return { orderId, total, checkout };
    } catch (e: any) {
      if (e?.code !== 6) throw e; // 6 = ALREADY_EXISTS
    }
  }
  throw new HttpError(500, "Không tạo được mã đơn");
}));

// 4b. Zalo gọi về khi khách tạo đơn / đổi trạng thái thanh toán (khai báo URL trong trang Checkout SDK).
// Không dùng handle(): Zalo cần phản hồi dạng {returnCode, returnMessage}.
export const checkoutCallback = onRequest({ secrets: [CHECKOUT_PRIVATE_KEY] }, async (req, res) => {
  try {
    const { ok, data } = verifyCallback(req.body, CHECKOUT_PRIVATE_KEY.value());
    if (!ok) { res.json({ returnCode: 0, returnMessage: "invalid mac" }); return; }
    let extra: any = data.extradata;
    if (typeof extra === "string") { try { extra = JSON.parse(decodeURIComponent(extra)); } catch { extra = {}; } }
    const orderId = String(extra?.orderId || "");
    const ref = orderId ? db.doc(`orders/${orderId}`) : null;
    const snap = ref ? await ref.get() : null;
    if (!ref || !snap?.exists) { res.json({ returnCode: 0, returnMessage: "order not found" }); return; }
    const update: Record<string, unknown> = { zaloOrderId: String(data.orderId || ""), updatedAt: FieldValue.serverTimestamp() };
    if (data.resultCode !== undefined) {
      if (snap.get("paymentStatus") === "paid") { res.json({ returnCode: 1, returnMessage: "already paid" }); return; }
      const amountOk = data.amount === undefined || Number(data.amount) === Number(snap.get("total"));
      update.paymentStatus = Number(data.resultCode) !== 1 ? "failed" : amountOk ? "paid" : "amount_mismatch";
      update.transId = String(data.transId || "");
    }
    await ref.update(update);
    res.json({ returnCode: 1, returnMessage: "success" });
  } catch (e) {
    console.error(e);
    res.json({ returnCode: 0, returnMessage: "error" });
  }
});

// Client hỏi để ẩn/hiện link "Dành cho nhân viên". Bảo mật thật vẫn nằm ở requireStaff.
export const isStaff = onRequest(opts, handle(async (body) => {
  const u = await auth(body);
  const s = await db.doc(`staff/${u.id}`).get();
  return { staff: s.exists && s.get("active") === true };
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

// Nhân viên quét QR → xem tem + voucher của khách (chưa thay đổi gì)
export const lookupMember = onRequest(opts, handle(async (body) => {
  const staff = await requireStaff(body);
  const memberId = verifyMemberQr(str(body.qr, "qr"), QR_SECRET.value());
  const m = await readMember(memberId);
  if (!m.exists) throw new HttpError(400, "Thành viên không tồn tại");
  return { name: m.name, stamps: m.stamps, vouchers: m.vouchers, staff: { name: staff.name, storeId: staff.storeId } };
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
