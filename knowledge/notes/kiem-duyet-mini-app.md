---
type: concept
tags: [zalo-mini-app, kiem-duyet]
aliases: []
sources: ["[[sources/bao-cao-gemini-zalo-mini-app-2026]]"]
created: 2026-11-23
updated: 2026-11-23
---
# Kiểm duyệt Zalo Mini App

**Tóm tắt:** Các tiêu chí Zalo xét trước khi cho app lên Production; duyệt trong 3 ngày làm việc.

## Nội dung chính
- Hay bị từ chối: xin quyền SĐT ngay khi mở app; thiếu Checkout SDK khi có giá + đặt món.
- Phải có nút "Từ chối" và vẫn dùng được tính năng không cần quyền.
- Hiệu suất: PageLoad < 1.5s, LCP < 2.5s, không quá 10s.
- Bắt buộc trang Chính sách bảo mật + Điều khoản ghi rõ tên Mini App và đơn vị sở hữu.
- Sau khi lên: tối thiểu 10 lượt truy cập/tháng, nếu không 3 tháng liền có thể bị hạn chế.

## Related notes
- [[notes/checkout-sdk]] – yêu cầu
- [[notes/getphonenumber-token]] – ràng buộc cách gọi
- [[notes/luat-bvdlcn-2025]] – yêu cầu tuân thủ
- [[notes/xac-thuc-chu-so-huu-mini-app]] – bước sau

## Sources
- [[sources/bao-cao-gemini-zalo-mini-app-2026]]
