import React from "react";
import { useNavigate } from "zmp-ui";
import { Product } from "../data/types";
import { vnd } from "../state/cart";

export default function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate();
  return (
    <button className="pcard" onClick={() => navigate(`/product/${p.id}`)}>
      <div className="pimg">{p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <span style={{ background: p.color }} />}</div>
      <div className="info">{p.name}<br /><span className="price">{vnd(p.price)}</span></div>
    </button>
  );
}
