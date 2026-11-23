// Mọi việc ghi dữ liệu quan trọng (đơn hàng, cộng tem) đi qua server (Firebase Cloud Functions).
// Ở chế độ MOCK, dữ liệu lưu tạm trong localStorage để xem demo.
import { MOCK, CheckoutParams } from "./zalo";
import { CartItem, Voucher } from "../data/types";

const API = import.meta.env.VITE_API_BASE as string | undefined;

export interface Member { stamps: number; vouchers: Voucher[]; history: { text: string; date: string }[]; qr?: string }

const KEY = "nien-demo-member";
const defaultMember: Member = {
  stamps: 3,
  vouchers: [{ id: "v1", title: "Giảm 20% đơn từ 80k", badge: "-20%", expires: "15/12/2026" }],
  history: [
    { text: "+1 tem · Niên Lê Lai", date: "20/11" },
    { text: "+1 tem · Niên Lê Lai", date: "18/11" },
    { text: "+1 tem · Niên Lê Lai", date: "12/11" },
  ],
};

function readMock(): Member {
  try { return JSON.parse(localStorage.getItem(KEY) || "") as Member; } catch { return defaultMember; }
}
function writeMock(m: Member) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ } }

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    let msg = `API ${path} lỗi ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = String(j.error); } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** QR giả cùng định dạng server (NIEN1.<id>.<exp>.<mac>), hạn 5 phút. */
export function mockQr(id = "mock-user-1") {
  return `NIEN1.${id}.${Math.floor(Date.now() / 1000) + 300}.mock`;
}
function checkMockQr(qr: string) {
  const p = qr.trim().split(".");
  if (p.length !== 4 || p[0] !== "NIEN1") throw new Error("QR không hợp lệ");
  if (Number(p[2]) < Date.now() / 1000) throw new Error("QR đã hết hạn");
}

export async function getMember(accessToken = "mock"): Promise<Member> {
  if (MOCK) return { ...readMock(), qr: mockQr() };
  return post<Member>("/getMember", { accessToken });
}

export type PayMethod = "COD" | "BANK";
export interface OrderInput { storeId: string; items: CartItem[]; total: number; phoneToken: string; accessToken: string; method: PayMethod }
export interface OrderResult { orderId: string; total: number; checkout: CheckoutParams }

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const orderId = "NIEN-" + Math.floor(1000 + Math.random() * 9000);
    saveMockOrder({
      id: orderId, name: "Minh Anh (demo)", phone: "0900000000", storeId: input.storeId, total: input.total,
      items: input.items.map((i) => ({ name: i.product.name, qty: i.qty, options: Object.fromEntries(Object.entries(i.options).map(([g, o]) => [g, o.label])), note: i.note })),
      status: "pending", paymentMethod: input.method, paymentStatus: "unpaid", createdAt: Date.now(),
    });
    return { orderId, total: input.total, checkout: { amount: input.total, desc: `Niên - đơn ${orderId}`, item: [], extradata: JSON.stringify({ orderId }), method: JSON.stringify({ id: input.method, isCustom: false }), mac: "mock" } };
  }
  // Server tự tính lại giá từ Firestore (không tin total từ client)
  return post("/createOrder", {
    accessToken: input.accessToken,
    phoneToken: input.phoneToken,
    method: input.method,
    storeId: input.storeId,
    items: input.items.map((i) => ({
      productId: i.product.id, qty: i.qty, note: i.note,
      options: Object.fromEntries(Object.entries(i.options).map(([g, o]) => [g, o.id])),
    })),
  });
}

/** Demo: mô phỏng nhân viên quét QR cộng 1 tem. Bản thật chỉ tài khoản nhân viên mới gọi được. */
export async function mockAddStamp(): Promise<Member> {
  const m = readMock();
  m.stamps += 1;
  m.history.unshift({ text: "+1 tem · Niên Lê Lai", date: new Date().toLocaleDateString("vi-VN").slice(0, 5) });
  if (m.stamps >= 10) {
    m.stamps -= 10;
    m.vouchers.unshift({ id: "free-" + Date.now(), title: "1 ly miễn phí", badge: "FREE", expires: "30 ngày" });
  }
  writeMock(m);
  return m;
}

/** Người dùng có phải nhân viên không (chỉ để ẩn/hiện link; server vẫn kiểm tra quyền). MOCK: luôn true để xem demo. */
export async function isStaff(accessToken: string): Promise<boolean> {
  if (MOCK) return true;
  try { return (await post<{ staff: boolean }>("/isStaff", { accessToken })).staff; } catch { return false; }
}

// ===== Nhân viên (server kiểm tra quyền staff; MOCK thao tác trên member demo) =====
export interface LookupResult { name: string; stamps: number; vouchers: Voucher[] }

export async function lookupMember(accessToken: string, qr: string): Promise<LookupResult> {
  if (MOCK) { checkMockQr(qr); const m = readMock(); return { name: "Minh Anh (demo)", stamps: m.stamps, vouchers: m.vouchers }; }
  return post("/lookupMember", { accessToken, qr });
}

/** Nhân viên quét QR thành viên để cộng tem (Cloud Function addStamp kiểm tra quyền staff). */
export async function addStamp(accessToken: string, qr: string, count = 1): Promise<{ stamps: number; newVouchers: number }> {
  if (MOCK) {
    checkMockQr(qr);
    const before = readMock().vouchers.length;
    let m = readMock();
    for (let k = 0; k < count; k++) m = await mockAddStamp();
    return { stamps: m.stamps, newVouchers: m.vouchers.length - before };
  }
  return post("/addStamp", { accessToken, qr, count });
}

export async function redeemVoucher(accessToken: string, qr: string, voucherId: string): Promise<{ ok: boolean; voucherId: string }> {
  if (MOCK) {
    checkMockQr(qr);
    const m = readMock();
    const v = m.vouchers.find((x) => x.id === voucherId);
    if (!v) throw new Error("Voucher không tồn tại");
    m.vouchers = m.vouchers.filter((x) => x.id !== voucherId);
    m.history.unshift({ text: `Dùng voucher: ${v.title}`, date: new Date().toLocaleDateString("vi-VN").slice(0, 5) });
    writeMock(m);
    return { ok: true, voucherId };
  }
  return post("/redeemVoucher", { accessToken, qr, voucherId });
}

// ===== Đơn hàng cho nhân viên (server chỉ trả đơn của chi nhánh nhân viên) =====
export type OrderStatus = "pending" | "making" | "ready" | "done" | "cancelled";
export interface StaffOrder {
  id: string; name: string; phone: string | null; storeId: string; total: number;
  items: { name: string; qty: number; options: Record<string, string>; note: string }[];
  status: OrderStatus; paymentMethod: PayMethod; paymentStatus: string; createdAt: number;
}
/** Bước tiếp theo hợp lệ (khớp NEXT_STATUS ở server). */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = { pending: "making", making: "ready", ready: "done" };

const ORDERS_KEY = "nien-demo-orders-v2";
function readMockOrders(): StaffOrder[] {
  try { const v = JSON.parse(localStorage.getItem(ORDERS_KEY) || ""); if (Array.isArray(v)) return v; } catch { /* ignore */ }
  const now = Date.now();
  return [
    { id: "NIEN-2041", name: "Lan", phone: "0912345678", storeId: "starcity", total: 55000, items: [{ name: "Cà phê Sữa Sài Gòn", qty: 1, options: { "Đường": "Vừa", "Đá": "Ít đá" }, note: "" }, { name: "Croissant bơ", qty: 1, options: {}, note: "" }], status: "pending", paymentMethod: "BANK", paymentStatus: "unpaid", createdAt: now - 3 * 60000 },
    { id: "NIEN-2040", name: "Hùng", phone: "0987654321", storeId: "starcity", total: 90000, items: [{ name: "Latte", qty: 2, options: { "Espresso": "2 shot", "Đường": "Ít" }, note: "mang đi" }], status: "making", paymentMethod: "COD", paymentStatus: "unpaid", createdAt: now - 9 * 60000 },
  ];
}
function writeMockOrders(o: StaffOrder[]) { try { localStorage.setItem(ORDERS_KEY, JSON.stringify(o.slice(0, 50))); } catch { /* ignore */ } }
function saveMockOrder(o: StaffOrder) { writeMockOrders([o, ...readMockOrders()]); }

export async function listOrders(accessToken: string, status?: OrderStatus): Promise<StaffOrder[]> {
  if (MOCK) return readMockOrders().filter((o) => !status || o.status === status);
  return (await post<{ orders: StaffOrder[] }>("/listOrders", { accessToken, status })).orders;
}

/** Đổi trạng thái (status) và/hoặc xác nhận đã nhận tiền chuyển khoản (paid=true). */
export async function updateOrderStatus(accessToken: string, orderId: string, change: { status?: OrderStatus; paid?: boolean }): Promise<StaffOrder> {
  if (MOCK) {
    const all = readMockOrders();
    const o = all.find((x) => x.id === orderId);
    if (!o) throw new Error("Đơn không tồn tại");
    if (change.status) {
      if (NEXT_STATUS[o.status] !== change.status && !(change.status === "cancelled" && NEXT_STATUS[o.status])) throw new Error(`Không thể chuyển ${o.status} → ${change.status}`);
      o.status = change.status;
    }
    if (change.paid) { if (o.paymentStatus === "paid") throw new Error("Đơn đã thanh toán"); o.paymentStatus = "paid"; }
    writeMockOrders(all);
    return o;
  }
  return post("/updateOrderStatus", { accessToken, orderId, ...change });
}
