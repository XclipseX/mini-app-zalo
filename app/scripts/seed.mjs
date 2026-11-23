// Seed dữ liệu menu (categories, products, stores) + staff (tuỳ chọn) lên Firestore.
// Chạy từ app/functions (để dùng firebase-admin đã cài ở đó):
//   cd functions && node ../scripts/seed.mjs
// Emulator: FIRESTORE_EMULATOR_HOST=localhost:8080 node ../scripts/seed.mjs
// Thêm nhân viên: STAFF_ZALO_ID=<zaloId> STAFF_NAME="Tên" STAFF_STORE_ID=<storeId> node ../scripts/seed.mjs
// Prod: cần quyền ADC (gcloud auth application-default login) hoặc GOOGLE_APPLICATION_CREDENTIALS.
// seed-data.json sinh từ src/data/menu.ts — cập nhật lại khi menu đổi.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../functions/package.json"));
const admin = require("firebase-admin");

const rc = JSON.parse(readFileSync(join(here, "../.firebaserc"), "utf8"));
const projectId = process.env.GCLOUD_PROJECT || rc.projects.default;
admin.initializeApp({ projectId });
const db = admin.firestore();

const data = JSON.parse(readFileSync(join(here, "seed-data.json"), "utf8"));

async function writeAll(col, items) {
  const batch = db.batch();
  for (const it of items) batch.set(db.collection(col).doc(String(it.id)), it);
  await batch.commit();
  console.log(`✔ ${col}: ${items.length}`);
}

await writeAll("categories", data.categories);
await writeAll("products", data.products);
await writeAll("stores", data.stores);

if (process.env.STAFF_ZALO_ID) {
  await db.collection("staff").doc(process.env.STAFF_ZALO_ID).set({
    name: process.env.STAFF_NAME || "Nhân viên",
    storeId: process.env.STAFF_STORE_ID || data.stores[0]?.id,
    active: true,
  });
  console.log(`✔ staff: ${process.env.STAFF_ZALO_ID}`);
}
console.log(`Xong (project ${projectId}${process.env.FIRESTORE_EMULATOR_HOST ? ", emulator" : ""}).`);
