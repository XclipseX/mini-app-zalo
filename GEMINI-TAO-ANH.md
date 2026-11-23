# Nhiệm vụ cho Gemini (Antigravity): tạo ảnh mockup món cho app Niên

Đọc `AGENTS.md` và `brand/README.md` trước. CHỈ thêm file ảnh, KHÔNG sửa code (app đã tự lấy ảnh theo tên file).

## Chỗ đặt ảnh
- Thư mục: `app/public/images/menu/`
- Tên file = mã món, định dạng **WebP**, ví dụ `app/public/images/menu/latte.webp`
- Kích thước **800×800 px** (vuông), dung lượng **≤ 80 KB/ảnh** (Zalo yêu cầu app tải nhanh < 1,5 giây)
- Món nào chưa có ảnh thì app tự hiện hình tròn màu, nên làm đến đâu thấy đến đó.

## Phong cách (giống nhau cho mọi ảnh)
- Ảnh chụp sản phẩm kiểu studio, nhìn ngang hơi chéo 3/4, **một ly/món ở giữa**, chiếm ~60% khung.
- Nền trơn màu kem **#FFEFC6** (Soft Vanilla), ánh sáng mềm từ trái, bóng đổ nhẹ.
- Ly giấy hoặc ly thuỷ tinh trong; nếu là ly giấy thì màu xanh đậm **#16381F** với logo chữ "Niên" nhỏ màu trắng (không bắt buộc).
- Có thể thêm 1–2 đạo cụ nhỏ màu cam **#E76433** hoặc xanh **#0A6836** (hạt cà phê, lá trà). Không chữ, không watermark, không người.

## Danh sách món (mã → mô tả)
| File | Món | Gợi ý hình |
|---|---|---|
| phin.webp | Cà phê Phin | phin nhôm đặt trên ly thuỷ tinh, cà phê đen nhỏ giọt |
| da.webp | Cà phê Đá | ly thuỷ tinh cà phê đen với đá viên |
| suada.webp | Cà phê Sữa Sài Gòn | cà phê sữa đá, lớp sữa đặc nâu nhạt |
| trung.webp | Cà phê Trứng | tách sứ, lớp kem trứng vàng bông xốp phía trên |
| dua.webp | Cà phê Dừa | ly cà phê với lớp cốt dừa trắng đá xay, vụn dừa |
| daxay.webp | Cà phê Đá xay | ly đá xay cà phê, kem tươi phía trên |
| americano.webp | Americano | ly americano đen với đá |
| latte.webp | Latte | tách latte có latte art hình lá |
| cappu.webp | Cappuccino | tách cappuccino bọt sữa dày, rắc bột cacao |
| matcha.webp | Matcha Latte | ly matcha latte xanh lá với lớp sữa |
| dao.webp | Trà Đào | ly trà đào cam với lát đào và đá |
| croissant.webp | Croissant bơ | bánh croissant vàng giòn trên đĩa nhỏ |

## Xong thì
1. Kiểm tra: `cd app && npm install && npm run dev`, mở http://localhost:3000, xem trang Home, Menu và chi tiết món.
2. Mỗi ảnh ≤ 80 KB (nếu lớn hơn: giảm chất lượng WebP còn 75–80).
3. Commit "Add AI mockup product images" và push lên nhánh `ccr-9c0f1ce5-f6i58o`.

Lưu ý: đây là **ảnh minh hoạ do AI tạo**. Trước khi gửi Zalo duyệt nên thay bằng ảnh chụp món thật của quán.
