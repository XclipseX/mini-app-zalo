---
type: architecture
updated: 2026-11-23
---
# App structure
- `app/` React + Vite + zmp-ui 1.11 + zmp-sdk 2.54. `VITE_MOCK` (mặc định true) = dữ liệu giả; `VITE_WEB_DEMO=true` = MemoryRouter + khung điện thoại cho bản demo web.
- `src/services/zalo.ts` bọc zmp-sdk (getPhoneNumber chỉ trả token → server đổi ra SĐT).
- `src/services/api.ts` gọi Firebase Cloud Functions (chưa làm); mock dùng localStorage.
- Demo: https://claude.ai/artifact/2RrpDDDKkjMgAKx3bRQkaf (build inline 1 file từ `www/`).
- Brand: `brand/README.md` (màu #16381F, #0A6836, #879466, #E76433, #FFEFC6).
