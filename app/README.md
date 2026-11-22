# Niên – Zalo Mini App (demo)

Đặt món nhận tại quán · Tích 10 tem đổi 1 ly · Voucher. React + Vite + zmp-ui + zmp-sdk.

## Chạy thử trên máy (không cần Zalo, không cần Firebase)
```
cd app
npm install
npm run dev
```
Mở http://localhost:3000 – bấm F12 → chế độ điện thoại (Ctrl+Shift+M) để xem như mobile.
Mặc định chạy chế độ giả lập (`VITE_MOCK` không đặt = true): SĐT, tem, đơn hàng đều là dữ liệu giả.

## Cấu trúc
| Thư mục | Nội dung |
|---|---|
| `src/pages` | home, menu, product (chi tiết món), cart (giỏ + đặt món), rewards (QR, tem, voucher), privacy |
| `src/data/menu.ts` | Menu giả theo brand guideline → sau này đọc từ Firestore |
| `src/services/zalo.ts` | Bọc zmp-sdk: lấy user, xin SĐT đúng lúc đặt hàng (có chế độ mock) |
| `src/services/api.ts` | Gọi server (Firebase Cloud Functions): tạo đơn, lấy thông tin tem |
| `src/state` | Giỏ hàng, thông tin thành viên |
| `src/theme.css` | Màu Niên: #16381F, #0A6836, #879466, #E76433, #FFEFC6 |

## Việc còn lại
- [ ] Mini App ID (cô tạo) → điền `app_id` trong `zmp-cli.json`, rồi `zmp login`, `zmp deploy`
- [ ] Firebase: Firestore (menu, đơn, tem) + Cloud Functions (verify user, đổi token SĐT, cộng tem, tạo đơn Checkout SDK)
- [ ] Checkout SDK (bắt buộc khi có giá + đặt món), phương thức COD/chuyển khoản
- [ ] Màn hình nhân viên quét QR cộng tem
- [ ] Ảnh món thật (WebP, để trên Firebase Storage), font SVN-Arlen-Chunky / SVN-Gilroy, logo SVG
- [ ] Hoàn thiện Chính sách bảo mật (tên HKD/Công ty)
