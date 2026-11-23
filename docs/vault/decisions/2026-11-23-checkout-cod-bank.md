---
type: decision
date: 2026-11-23
status: accepted
---
# Checkout SDK chỉ dùng COD + chuyển khoản
Không phí trung gian, quán tự xác nhận đã thu. mac ký ở server (createOrder), client truyền nguyên văn cho `Payment.createOrder`. Mặc định phương thức `_SANDBOX` (env CHECKOUT_SANDBOX) tới khi duyệt xong. Link nhân viên ẩn bằng `isStaff` chỉ là UX; quyền thật vẫn ở `requireStaff`.
