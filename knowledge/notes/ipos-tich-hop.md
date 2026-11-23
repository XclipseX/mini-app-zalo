---
type: concept
tags: [pos, ipos, tich-hop]
aliases: [iPOS, POS]
sources: ["[[sources/bao-cao-gemini-ipos]]"]
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

## Cập nhật từ báo cáo Gemini (23/11)
- iPOS có API **chỉ cấp cho đối tác**, không tự tạo key: Push đơn qua **Foodbook** (`api.foodbook.vn`, sandbox `apitest.foodbook.vn`); Pull hoá đơn qua **iPOS Data Warehouse** (`dwapis.ipos.vn`); webhook xin qua email `support@ipos.vn`. Nguồn: tài liệu CNV Loyalty, Oviro, OmniVN, LadiFlow (bên thứ ba).
- Xác thực: Access Token + POS/Parent/Store ID do iPOS/Foodbook cấp. Payload JSON, phí, rate limit, điều kiện cho quán lẻ: **chưa xác minh**.
- Đơn từ nền tảng ngoài vào POS: phải **map thực đơn**; FoodHub yêu cầu nhân viên bấm xác nhận đơn (tự in bếp hay không: chưa xác minh).
- Liên hệ: tổng đài iPOS 1900 4766 (nhánh 2), support@ipos.vn. Thuê bao FABi niêm yết 250.000đ/tháng.
- iPOS đóng nhất so với KiotViet (Public API FnB, OAuth tự lấy key), MISA CukCuk (Open Platform), POS365 (có đặc tả API).
- Dự phòng: thu ngân nhập lại đơn vào iPOS trên "bàn ảo Zalo Mini App"; thêm âm báo đơn mới ở `/staff/orders`. Không dùng iPOS WebOrder thay app.
- Điều 9 điều khoản iPOS cấm dò quét/can thiệp API trái phép → chỉ dùng kênh được cấp.

## Related notes
- [[notes/nien]] – tính năng giai đoạn 2 của

## Sources
- Tìm kiếm web 23/11/2026: ipos.vn/cong-cu-ipos-web-order, huongdan.ipos.vn/docs/huong-dan-nhan-don-order-online-tu-kenh-zalo (không mở được trang đầy đủ do mạng sandbox chặn)
