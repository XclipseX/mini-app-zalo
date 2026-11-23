---
type: decision
date: 2026-11-23
status: accepted
---
# Dùng Lucian UX/UI cho các phần tương tác
Skill `.agents/skills/lucian-uxui` (CLI tải mẫu từ lucianlabs.dev / GitHub, MIT). Đã port sang React trong `app/src/lucian/`:
- #353 Stamp-collecting coffee card → Rewards (tem từ server, đóng dấu khi tăng, đủ 10 lật mặt "1 ly miễn phí"; nút Demo chỉ ở mock).
- #018 Rolling quantity stepper → Chi tiết món (số lăn, tổng tiền đếm dần).
- #015 Plan radio cards → Giỏ hàng, chọn Trả tại quầy / Chuyển khoản.
- #039 Sliding pill tabs → danh mục Menu (lưới món trượt theo hướng) + bộ lọc đơn nhân viên.
- #041 Notched bottom tab bar → thanh tab dưới (`components/bottom-nav.tsx`), badge số món trên tab Menu.
- #442 Add to cart → Chi tiết món: món bay vào nút giỏ, giỏ lắc, badge nảy.
- #444 Checkout steps → màn đặt thành công: Đặt món → Quán nhận → Sẵn sàng → Nhận đồ (chỉ hiển thị).
- #073 Rolling announcement banner → Home (chỉ dải thông báo, nút × đóng).
- #424 FAQ accordion → trang Chính sách bảo mật.
- #435 Toast notifications → thay snackbar zmp-ui toàn app (`useToast()`, cùng API openSnackbar).
- #052 Flip-around membership card: ĐÃ BỎ theo yêu cầu user (23/11) – Rewards chỉ giữ thẻ mã QR đơn giản + nút "Làm mới mã".
- #439 Skeleton → khi đang tải thẻ thành viên (Rewards) và danh sách đơn (nhân viên).
- Thẻ tem #353 bỏ khung 340×340 cố định → rộng bằng các thẻ khác (margin 14px).
- Thanh tab #041 đã hạ thấp: bong bóng 46px nhô ~7px.
Token `--ux-*` trỏ về màu Niên trong `app/src/lucian/lucian.css`; giữ nguyên kích thước, đường cong, thời lượng chuyển động. Giữ dòng license ở đầu mỗi file.
Lần sau: tìm mẫu bằng `node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs search <từ khoá>` trước khi tự viết UI mới.
