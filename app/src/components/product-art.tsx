import React, { useState } from "react";
import { Product } from "../data/types";

/** Ảnh món: lấy public/images/menu/<id>.webp; chưa có ảnh thì hiện hình tròn màu thay thế. */
// Gốc app lấy một lần lúc khởi động (trước khi router đổi địa chỉ), để đường dẫn ảnh không lệch ở /product/:id
const APP_BASE = typeof location !== "undefined" ? location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "") : "./";
export const asset = (path: string) => (/^(https?:|data:)/.test(path) ? path : APP_BASE + path.replace(/^\.\//, ""));
export const productImage = (p: Product) => asset(p.image || `images/menu/${p.id}.webp`);

export default function ProductArt({ p, className, eager = false, artRef }: { p: Product; className?: string; eager?: boolean; artRef?: React.Ref<HTMLSpanElement> }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span ref={artRef} className={className} style={{ background: p.color }} />;
  return (
    <span ref={artRef} className={(className || "") + " has-img"}>
      <img src={productImage(p)} alt={p.name} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} />
    </span>
  );
}
