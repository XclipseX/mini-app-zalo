import { createHmac, timingSafeEqual } from "crypto";
import { HttpError } from "./http";

const TTL = 5 * 60; // 5 phút

function sign(id: string, exp: number, key: string) {
  return createHmac("sha256", key).update(`NIEN1.${id}.${exp}`).digest("hex").slice(0, 16);
}

// Tạo QR thành viên
export function makeMemberQr(zaloId: string, key: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return `NIEN1.${zaloId}.${exp}.${sign(zaloId, exp, key)}`;
}

// Kiểm tra QR, trả zaloId
export function verifyMemberQr(qr: string, key: string): string {
  const p = String(qr || "").trim().split(".");
  if (p.length !== 4 || p[0] !== "NIEN1") throw new HttpError(400, "QR không hợp lệ");
  const [, id, expS, mac] = p;
  const exp = Number(expS);
  const good = Buffer.from(sign(id, exp, key));
  const got = Buffer.from(mac);
  if (!Number.isFinite(exp) || good.length !== got.length || !timingSafeEqual(good, got)) {
    throw new HttpError(400, "QR sai chữ ký");
  }
  if (exp < Date.now() / 1000) throw new HttpError(400, "QR đã hết hạn");
  return id;
}
