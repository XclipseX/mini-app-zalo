---
type: concept
tags: [zalo-mini-app, ky-thuat, bao-mat]
aliases: [appsecret_proof]
sources: ["[[sources/bao-cao-gemini-zalo-mini-app-2026]]"]
created: 2026-11-23
updated: 2026-11-23
---
# getPhoneNumber / getLocation trả token

**Tóm tắt:** API client không trả SĐT/toạ độ thật mà trả token; server đổi token bằng secret key.

## Nội dung chính
- Token SĐT dùng 1 lần, hết hạn sau 2 phút.
- Server gọi GET graph.zalo.me/v2.0/me/info với header access_token, code, secret_key.
- Xác thực user: GET graph.zalo.me/v2.0/me kèm appsecret_proof = HMAC-SHA256(access_token, secret_key) (công thức từ cộng đồng, chưa xác minh chính thức).
- Không bao giờ để secret_key trong code app.

## Related notes
- [[notes/chuong-trinh-tich-tem]] – dùng để chống gian lận
- [[notes/kiem-duyet-mini-app]] – phải xin đúng lúc

## Sources
- [[sources/bao-cao-gemini-zalo-mini-app-2026]]
