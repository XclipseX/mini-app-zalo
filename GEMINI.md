# Niên Zalo Mini App – hướng dẫn cho AI agent

Mục tiêu: **đọc ít, đọc đúng chỗ** để tiết kiệm token. Trả lời tiếng Việt, ngắn gọn.

## Đầu phiên (bắt buộc, theo thứ tự)
1. Đọc `docs/vault/00-Index.md` rồi note mới nhất trong `docs/vault/sessions/`. **Không** đọc lại cả repo.
2. Cần hiểu cấu trúc code → đọc `app/graphify-out/GRAPH_REPORT.md` hoặc chạy
   `cd app && graphify query "<câu hỏi>" --budget 1500` / `graphify explain "<Tên>"` / `graphify affected "<Tên>"`.
   Chỉ mở file nguồn khi đã biết đúng file cần sửa.
3. Câu hỏi về Zalo, pháp lý, chi phí, brand → `grep -ril "<từ khoá>" knowledge/` và đọc note khớp,
   **không** đọc lại báo cáo gốc hay tìm lại trên web.

## Khi làm việc
- Đọc file theo đoạn (offset/limit, grep) thay vì cả file. Không đọc `node_modules`, `www`, `graphify-out/cache`, `package-lock.json`.
- Không dán lại code dài vào câu trả lời; chỉ nêu file:dòng và phần thay đổi.
- Thông tin mới từ tài liệu user gửi → lưu vào `knowledge/` (skill knowledge-vault) để lần sau khỏi đọc lại.

## Cuối phiên (bắt buộc)
1. Sửa code → `cd app && graphify update . && graphify export obsidian --dir ../docs/vault/graph`.
2. Ghi `docs/vault/sessions/<YYYY-MM-DD>.md`: đã làm gì, quyết định gì, việc tiếp theo. Quyết định mới → `docs/vault/decisions/`.
3. Commit + push (phiên cloud sẽ bị xoá).

## Quy ước với user
- Không tự viết/sửa proposal khi user chưa bảo. Gửi file .docx, không gửi PDF.
- Skills dự án: `.agents/skills/` (Claude đọc qua `.claude/skills`).
