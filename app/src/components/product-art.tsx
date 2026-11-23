import React, { useState } from "react";
import { Product } from "../data/types";

/** Ảnh món: lấy public/images/menu/<id>.webp; chưa có ảnh thì hiện hình tròn màu thay thế. */
// Gốc app lấy một lần lúc khởi động (trước khi router đổi địa chỉ), để đường dẫn ảnh không lệch ở /product/:id
const APP_BASE = typeof location !== "undefined" ? location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "") : "./";
export const asset = (path: string) => (/^(https?:|data:)/.test(path) ? path : APP_BASE + path.replace(/^\.\//, ""));
export const productImage = (p: Product) => asset(p.image || `images/menu/${p.id}.webp`);

/** Tải sẵn (và giải mã sẵn) ảnh tất cả món, chạy ngầm sau khi màn đầu tiên hiện xong để không ảnh hưởng tốc độ mở app. */
const preloaded = new Map<string, HTMLImageElement>(); // giữ tham chiếu để ảnh nằm sẵn trong bộ nhớ
export function preloadProductImages(list: Product[]) {
  const run = () => list.forEach((p) => {
    const src = productImage(p);
    if (preloaded.has(src)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.decode?.().catch(() => { /* món chưa có ảnh → bỏ qua */ });
    preloaded.set(src, img);
  });
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1500 }); else setTimeout(run, 300);
}

export default function ProductArt({ p, className, eager = false, artRef }: { p: Product; className?: string; eager?: boolean; artRef?: React.Ref<HTMLSpanElement> }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span ref={artRef} className={className} style={{ background: p.color }} />;
  return (
    <span ref={artRef} className={(className || "") + " has-img"}>
      <img src={productImage(p)} alt={p.name} loading="eager" decoding="async" onError={() => setFailed(true)} />
    </span>
  );
}
