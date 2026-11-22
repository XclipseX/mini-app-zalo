// Lớp bọc zmp-sdk. Khi VITE_MOCK=true (chạy trên trình duyệt) trả dữ liệu giả,
// vì getPhoneNumber / getAccessToken chỉ chạy trong app Zalo thật.
import { getUserInfo, getSetting, authorize, getPhoneNumber, getAccessToken } from "zmp-sdk/apis";

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
