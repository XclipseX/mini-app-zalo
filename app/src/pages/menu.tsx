import React, { useState } from "react";
import { Page, useNavigate } from "zmp-ui";
import { categories, products } from "../data/menu";
import { useCart, vnd } from "../state/cart";
import ProductCard from "../components/product-card";

export default function MenuPage() {
  const [cat, setCat] = useState(categories[0].id);
  const { store, count, total } = useCart();
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="topbar">
        <h2>Menu</h2>
        <button className="cart-btn" aria-label={`Giỏ hàng, ${count} món`} onClick={() => navigate("/cart")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0" /></svg>
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </div>
      <div className="store">
        <div className="label">CỬA HÀNG NHẬN ĐƠN</div>
        <b>{store.name}</b>{store.address}
      </div>
      <div className="chips">
        {categories.map((c) => <button key={c.id} className={"chip" + (c.id === cat ? " on" : "")} onClick={() => setCat(c.id)}>{c.name}</button>)}
      </div>
      <div className="grid2">{products.filter((p) => p.categoryId === cat).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {count > 0 && <button className="cart-fab" onClick={() => navigate("/cart")}>🛒 {count} món · {vnd(total)}</button>}
    </Page>
  );
}
