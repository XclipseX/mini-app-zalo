---
type: decision
date: 2026-11-23
status: accepted
---
# Backend dùng Firebase
Firestore (menu, đơn, tem) + Cloud Functions (verify user bằng appsecret_proof, đổi token SĐT, cộng tem, tạo đơn Checkout SDK). Lý do: nhanh, không lỗi CORS như Google Apps Script. Lưu ý: Cloud Functions cần gói Blaze (gắn thẻ) – chưa xác minh giá 2026.
