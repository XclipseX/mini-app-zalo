import LucianPillTabs, { slideIn } from "../lucian/pill-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Page, useNavigate } from "zmp-ui";
import { categories, products } from "../data/menu";
import { useCart, vnd } from "../state/cart";
import ProductCard from "../components/product-card";

export default function MenuPage() {
  const [cat, setCat] = useState(categories[0].id);
  const grid = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  useEffect(() => { slideIn(grid.current, dir.current); }, [cat]);
  const { store, count, total } = useCart();
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="topbar">
        <h2>Menu</h2>
      </div>
      <div className="store">
        <div className="label">CỬA HÀNG NHẬN ĐƠN</div>
        <b>{store.name}</b>{store.address}
      </div>
      <LucianPillTabs label="Danh mục món" items={categories.map((c) => ({ id: c.id, label: c.name }))} value={cat}
        onChange={(id, d) => { dir.current = d; setCat(id); }} />
      <div ref={grid} className="grid2">{products.filter((p) => p.categoryId === cat).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {count > 0 && <button className="cart-fab" onClick={() => navigate("/cart")}>🛒 {count} món · {vnd(total)}</button>}
    </Page>
  );
}
