---
type: concept
tags: [zalo-mini-app, thanh-toan]
aliases: []
sources: ["[[sources/bao-cao-gemini-zalo-mini-app-2026]]"]
created: 2026-11-23
updated: 2026-11-23
---
# Checkout SDK

**Tóm tắt:** Bộ thanh toán của Zalo Mini App; bắt buộc khi app hiện giá và có nút đặt mua.

## Nội dung chính
- Phương thức: ZaloPay, MoMo, VNPay, PayME, COD, chuyển khoản (Beta).
- COD/chuyển khoản: không phí trung gian, quán tự xác nhận đã thu.
- Chữ ký `mac` HMAC-SHA256 tạo ở server bằng private key; cần zmp-sdk ≥ 2.37.
- *Suy luận:* ảnh hưởng báo giá – proposal đang để thanh toán ở gói Nâng cao [cần bổ sung: tự kiểm tra chính sách trên mini.zalo.me].

## Related notes
- [[notes/kiem-duyet-mini-app]] – bắt buộc bởi
- [[notes/nien]] – cần thêm vào gói 4 của

## Sources
- [[sources/bao-cao-gemini-zalo-mini-app-2026]]
