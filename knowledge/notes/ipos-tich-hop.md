---
type: concept
tags: [pos, ipos, tich-hop]
aliases: [iPOS, POS]
sources: []
created: 2026-11-23
updated: 2026-11-23
---
# Tích hợp iPOS

**Tóm tắt:** Niên dùng iPOS. Cô muốn đơn từ Mini App đổ về POS. iPOS chưa công khai API cho bên thứ ba → phải hỏi iPOS.

## Nội dung chính
- iPOS không có tài liệu API công khai (tìm 23/11/2026). Có kênh riêng: iPOS Web Order (link đặt món, đơn về máy POS), nhận đơn qua Zalo OA (hướng dẫn cũ, không nói Mini App).
- Một số đơn vị CRM quảng cáo connector iPOS → *suy luận:* iPOS có API cho đối tác đã đăng ký [cần bổ sung: xác nhận từ iPOS].
- Câu hỏi đã gửi cô để hỏi iPOS: API đẩy đơn, API lấy menu/giá, gói nào dùng được API, phí, đăng ký đối tác.
- Phạm vi: ngoài gói 4 → giai đoạn 2, báo giá riêng (ước 2–4 ngày). Tạm thời đơn hiện ở `/staff/orders`.
- Kỹ thuật: thêm bước trong Cloud Function `createOrder` đẩy đơn sang iPOS; khó nhất là map mã món/topping.

## Related notes
- [[notes/nien]] – tính năng giai đoạn 2 của

## Sources
- Tìm kiếm web 23/11/2026: ipos.vn/cong-cu-ipos-web-order, huongdan.ipos.vn/docs/huong-dan-nhan-don-order-online-tu-kenh-zalo (không mở được trang đầy đủ do mạng sandbox chặn)
