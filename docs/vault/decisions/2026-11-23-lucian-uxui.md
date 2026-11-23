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
Token `--ux-*` trỏ về màu Niên trong `app/src/lucian/lucian.css`; giữ nguyên kích thước, đường cong, thời lượng chuyển động. Giữ dòng license ở đầu mỗi file.
Lần sau: tìm mẫu bằng `node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs search <từ khoá>` trước khi tự viết UI mới.
