---
type: index
updated: 2026-11-23
---
# Niên Zalo Mini App – Index

> AI agents: đọc note này trước, rồi file mới nhất trong [[sessions]].

## Dự án
Zalo Mini App cho quán cà phê **Niên** (358 Lê Lai, Thanh Hóa). Khách hàng: cô Bích Ngọc. Gói 4 – 3.000.000đ: menu, đặt món nhận tại quán, voucher, tích 10 tem đổi 1 ly. Mục tiêu ~1 tuần code.

## Trạng thái
Demo mock xong. Đang chờ cô (cọc, Mini App ID, giấy tờ). Firebase backend đã viết (chưa deploy) – xem [[architecture/firestore-schema]]. Màn hình nhân viên `/staff` xong (mock chạy). Checkout SDK (COD + chuyển khoản) tích hợp xong, mock chạy. Màn hình đơn hàng nhân viên `/staff/orders` xong (có huỷ đơn; báo khách "sẵn sàng" qua ZBS template, chờ cấu hình secret). Việc tiếp: deploy Firebase thật, test Checkout sandbox khi có Mini App ID. Chi tiết: [[sessions/2026-11-23]].
Nhánh làm việc: `ccr-9c0f1ce5-f6i58o`.

## Architecture
- [[architecture/app-structure]]
- Bản đồ code: `app/graphify-out/GRAPH_REPORT.md`, note từng hàm trong [[graph/graph.canvas|graph/]] (graphify export). Hub: `useCart`, `vnd`, `zalo.ts`, `api.ts` → sửa cẩn thận.

## Decisions
- [[decisions/2026-11-23-checkout-cod-bank]]
- [[decisions/2026-11-23-firebase-backend]]
- [[decisions/2026-11-22-checkout-sdk-required]]
- [[decisions/2026-11-22-proposal-workflow]]

## Known bugs / gotchas
- zmp-ui icon font tải từ h5.zadn.vn → bị chặn trên claude.ai artifact (đã ẩn icon snackbar ở chế độ webdemo).
- `zmp login` hỏi Mini App ID ngay → chưa login được tới khi cô tạo ID.

## Recent sessions
- [[sessions/2026-11-23]]
