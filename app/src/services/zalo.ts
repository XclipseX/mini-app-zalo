// Lớp bọc zmp-sdk. Khi VITE_MOCK=true (chạy trên trình duyệt) trả dữ liệu giả,
// vì getPhoneNumber / getAccessToken chỉ chạy trong app Zalo thật.
import { getUserInfo, getSetting, authorize, getPhoneNumber, getAccessToken, scanQRCode, Payment } from "zmp-sdk/apis";

export const MOCK = import.meta.env.VITE_MOCK !== "false";

export interface ZaloUser { id: string; name: string; avatar: string }

export async function loadUser(): Promise<ZaloUser> {
  if (MOCK) return { id: "mock-user-1", name: "Minh Anh", avatar: "" };
  const { userInfo } = await getUserInfo({});
  return { id: userInfo.id, name: userInfo.name, avatar: userInfo.avatar };
}

/** Xin SĐT đúng lúc đặt hàng. Trả về token để server đổi ra số thật, hoặc null nếu khách từ chối. */
export async function requestPhoneToken(): Promise<{ phoneToken: string; accessToken: string } | null> {
  if (MOCK) return { phoneToken: "mock-phone-token", accessToken: "mock-access-token" };
  const { authSetting } = await getSetting({});
  if (!authSetting["scope.userPhonenumber"]) {
    try {
      await authorize({ scopes: ["scope.userPhonenumber"] });
    } catch {
      return null; // -201: khách từ chối, app vẫn phải dùng được
    }
  }
  const { token } = await getPhoneNumber({});
  const accessToken = await getAccessToken({});
  return token ? { phoneToken: token, accessToken } : null;
}

/** Access token để server xác thực người gọi (getMember, addStamp...). */
export async function getToken(): Promise<string> {
  if (MOCK) return "mock-access-token";
  return getAccessToken({});
}

/** Mở camera Zalo quét QR. Ở MOCK trả null để trang tự dùng QR giả. */
export async function scanQr(): Promise<string | null> {
  if (MOCK) return null;
  const { content } = await scanQRCode({});
  return content || null;
}

/** Tham số server trả về (đã ký mac) – truyền nguyên văn cho Checkout SDK. */
export interface CheckoutParams { amount: number; desc: string; item: { id: string; amount: number }[]; extradata: string; method: string; mac: string }

/** Mở Checkout SDK (COD / chuyển khoản). MOCK: bỏ qua, coi như tạo đơn thanh toán thành công. */
export async function payCheckout(p: CheckoutParams): Promise<{ zaloOrderId: string }> {
  if (MOCK) return { zaloOrderId: "mock-" + Date.now() };
  const { orderId } = await Payment.createOrder({ ...p });
  return { zaloOrderId: orderId };
}
