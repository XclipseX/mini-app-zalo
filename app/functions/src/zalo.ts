import { createHmac } from "crypto";
import { HttpError } from "./http";

const GRAPH = "https://graph.zalo.me/v2.0";

// Xác thực access token, trả về thông tin user
export async function verifyAccessToken(accessToken: string, appSecret: string) {
  const proof = createHmac("sha256", appSecret).update(accessToken).digest("hex");
  const r = await fetch(`${GRAPH}/me?fields=id,name,picture`, {
    headers: { access_token: accessToken, appsecret_proof: proof },
  });
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok || (j.error !== undefined && j.error !== 0) || !j.id) {
    throw new HttpError(401, j.message || "Access token không hợp lệ");
  }
  return { id: String(j.id), name: String(j.name || ""), picture: j.picture?.data?.url as string | undefined };
}

// Đổi phone token lấy số điện thoại
export async function getPhoneNumber(accessToken: string, phoneToken: string, appSecret: string) {
  const r = await fetch(`${GRAPH}/me/info`, {
    headers: { access_token: accessToken, code: phoneToken, secret_key: appSecret },
  });
  const j: any = await r.json().catch(() => ({}));
  const num = j?.data?.number;
  if (!r.ok || (j.error !== undefined && j.error !== 0) || !num) {
    throw new HttpError(400, j.message || "Không lấy được số điện thoại");
  }
  return String(num);
}
