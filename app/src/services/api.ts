// Mọi việc ghi dữ liệu quan trọng (đơn hàng, cộng tem) đi qua server (Firebase Cloud Functions).
// Ở chế độ MOCK, dữ liệu lưu tạm trong localStorage để xem demo.
import { MOCK } from "./zalo";
import { CartItem, Voucher } from "../data/types";

const API = import.meta.env.VITE_API_BASE as string | undefined;

export interface Member { stamps: number; vouchers: Voucher[]; history: { text: string; date: string }[] }

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
  if (!res.ok) throw new Error(`API ${path} lỗi ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getMember(accessToken = "mock"): Promise<Member> {
  if (MOCK) return readMock();
  return post<Member>("/member", { accessToken });
}

export interface OrderInput { storeId: string; items: CartItem[]; total: number; phoneToken: string; accessToken: string }

export async function createOrder(input: OrderInput): Promise<{ orderId: string }> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { orderId: "NIEN-" + Math.floor(1000 + Math.random() * 9000) };
  }
  // Server: xác thực accessToken (appsecret_proof), đổi phoneToken ra SĐT, tạo đơn Checkout SDK (mac), lưu Firestore
  return post("/orders", input);
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
