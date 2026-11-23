// Gửi ZBS Template Message (trước đây ZNS) qua SĐT. API: POST business.openapi.zalo.me/message/template.
// Cần OA access token (ZBS_ACCESS_TOKEN) + template id đã duyệt. Thiếu cấu hình → bỏ qua, không lỗi.
// TODO: OA access token hết hạn ~25h → cần luồng refresh_token (oauth.zaloapp.com/v4/oa/access_token).
import { logger } from "firebase-functions";

const ZBS_URL = "https://business.openapi.zalo.me/message/template";
const unset = (v?: string) => !v || v === "none" || v === "-";

/** "0912345678" / "+84912..." → "84912345678". Không hợp lệ → null. */
export function toZaloPhone(p?: string | null): string | null {
  const d = String(p || "").replace(/\D/g, "");
  if (/^84\d{9}$/.test(d)) return d;
  if (/^0\d{9}$/.test(d)) return "84" + d.slice(1);
  return null;
}

export async function sendZbsTemplate(opts: {
  accessToken?: string; templateId?: string; phone?: string | null;
  data: Record<string, string | number>; trackingId: string;
}): Promise<"sent" | "skipped" | "failed"> {
  const phone = toZaloPhone(opts.phone);
  if (unset(opts.accessToken) || unset(opts.templateId) || !phone) return "skipped";
  try {
    const r = await fetch(ZBS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", access_token: opts.accessToken! },
      body: JSON.stringify({ phone, template_id: opts.templateId, template_data: opts.data, tracking_id: opts.trackingId }),
    });
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok || j.error !== 0) { logger.warn("ZBS gửi lỗi", { trackingId: opts.trackingId, error: j.error, message: j.message }); return "failed"; }
    return "sent";
  } catch (e) {
    logger.warn("ZBS gửi lỗi", { trackingId: opts.trackingId, e: String(e) });
    return "failed";
  }
}
