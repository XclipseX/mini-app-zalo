// Checkout SDK của Zalo Mini App (COD + chuyển khoản).
// Tài liệu: https://mini.zalo.me/documents/checkout-sdk/
// mac = HMAC-SHA256(privateKey, các trường sắp xếp theo tên "key=value&..."), giá trị object → JSON.
import { createHmac, timingSafeEqual } from "crypto";

export type PayMethod = "COD" | "BANK";

export function hmac(key: string, data: string) {
  return createHmac("sha256", key).update(data).digest("hex");
}

export function sameMac(a: string, b: string) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

const enc = (v: unknown) => (typeof v === "object" ? JSON.stringify(v) : String(v));

/** Chuỗi ký cho Payment.createOrder: amount, desc, extradata, item, method (theo thứ tự abc). */
export function orderMacData(p: Record<string, unknown>) {
  return Object.keys(p).sort().map((k) => `${k}=${enc(p[k])}`).join("&");
}

/** Tham số gửi cho Payment.createOrder ở client. Client truyền nguyên văn, không sửa. */
export function buildCheckout(o: {
  orderId: string; storeId: string; total: number; method: PayMethod; sandbox: boolean;
  items: { productId: string; unitPrice: number; qty: number }[];
}, privateKey: string) {
  const params = {
    amount: o.total,
    desc: `Niên - đơn ${o.orderId}`,
    item: o.items.map((i) => ({ id: i.productId, amount: i.unitPrice * i.qty })),
    extradata: JSON.stringify({ orderId: o.orderId, storeId: o.storeId }),
    method: JSON.stringify({ id: o.sandbox ? `${o.method}_SANDBOX` : o.method, isCustom: false }),
  };
  return { ...params, mac: hmac(privateKey, orderMacData(params)) };
}

/**
 * Xác thực body Zalo gửi tới endpoint callback. Hai dạng:
 * - Notify (COD/chuyển khoản, khi khách tạo đơn): data {appId, orderId, method}
 * - Callback trạng thái thanh toán: data {appId, amount, description, orderId, message, resultCode, transId, extradata...}
 * [cần đối chiếu lại thứ tự trường với tài liệu trên mini.zalo.me khi có Mini App ID]
 */
export function verifyCallback(body: any, privateKey: string) {
  const d = body?.data || {};
  const mac = String(body?.mac || body?.overallMac || "");
  const raw = d.resultCode !== undefined
    ? `appId=${d.appId}&amount=${d.amount}&description=${d.description}&orderId=${d.orderId}&message=${d.message}&resultCode=${d.resultCode}&transId=${d.transId}`
    : `appId=${d.appId}&orderId=${d.orderId}&method=${d.method}`;
  return { ok: !!mac && sameMac(hmac(privateKey, raw), mac), data: d };
}
