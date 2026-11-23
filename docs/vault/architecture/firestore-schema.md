---
type: architecture
tags: [firebase, firestore, cloud-functions]
---

# Firestore schema & Cloud Functions

Backend: Firestore + Cloud Functions (region `asia-southeast1`). Người dùng Zalo **không dùng Firebase Auth**; client chỉ đọc `products`, `categories`, `stores`. Mọi dữ liệu khác chỉ truy cập qua Functions (Admin SDK). Xem `app/firestore.rules`.

## Collections

| Path | Fields | Client |
|---|---|---|
| `products/{id}` | như `Product` trong `app/src/data/types.ts` (name, enName, price, categoryId, color, optionGroups) | read |
| `categories/{id}` | như `Category` | read |
| `stores/{id}` | như `Store` | read |
| `members/{zaloId}` | name, phone?, stamps, totalStamps, createdAt, updatedAt | deny |
| `members/{zaloId}/vouchers/{id}` | title, badge, expiresAt, used, createdAt | deny |
| `members/{zaloId}/history/{id}` | text, delta, storeId, staffId, at | deny |
| `orders/{id}` | zaloId, name, phone, storeId, items[{productId, name, qty, options, unitPrice, note}], total, status, paymentMethod, createdAt | deny |
| `staff/{zaloId}` | name, storeId, active | deny |

Index composite (`app/firestore.indexes.json`): `orders` (zaloId ↑, createdAt ↓), (storeId ↑, status ↑, createdAt ↓). `history`/`vouchers` chỉ sắp xếp 1 field → không cần index.

## Functions

`verifyUser`, `resolvePhone`, `getMember`, `createOrder`, `lookupMember`, `addStamp`, `redeemVoucher` (3 hàm cuối chỉ staff) — region `asia-southeast1`.
Secrets: `ZALO_APP_SECRET`, `QR_SECRET`, `CHECKOUT_PRIVATE_KEY` (Checkout SDK). Orders có `paymentMethod` (COD/BANK), `paymentStatus` (unpaid/paid/failed), `zaloOrderId`, `transId`.

QR tích điểm: `NIEN1.<zaloId>.<exp>.<hmac16>` — HMAC (QR_SECRET) cắt 16 ký tự, hiệu lực 5 phút. Nhân viên (`staff/{zaloId}` active) quét → `addStamp`.

## Deploy

Trong `app/`:

1. `firebase login`
2. Sửa project trong `.firebaserc` (placeholder `nien-zalo-mini-app` — **phải thay bằng project thật**) hoặc `firebase use <project>`
3. `firebase functions:secrets:set ZALO_APP_SECRET`
4. `firebase functions:secrets:set QR_SECRET` và `firebase functions:secrets:set CHECKOUT_PRIVATE_KEY`
5. `firebase deploy` (rules, indexes, functions)
6. Seed menu: `cd functions && node ../scripts/seed.mjs` (cần ADC: `gcloud auth application-default login`). Emulator: thêm `FIRESTORE_EMULATOR_HOST=localhost:8080`.
7. Thêm nhân viên: `STAFF_ZALO_ID=<id> STAFF_NAME="..." STAFF_STORE_ID=<storeId> node ../scripts/seed.mjs` (hoặc tạo doc `staff/{zaloId}` trên console).
8. Env app: `VITE_MOCK=false`, `VITE_API_BASE=https://asia-southeast1-<project>.cloudfunctions.net`

`scripts/seed-data.json` sinh từ `src/data/menu.ts`; tạo lại khi menu đổi.
