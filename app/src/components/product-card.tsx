import ProductArt from "./product-art";
import React from "react";
import { useNavigate } from "zmp-ui";
import { Product } from "../data/types";
import { vnd } from "../state/cart";

export default function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate();
  return (
    <button className="pcard" onClick={() => navigate(`/product/${p.id}`)}>
      <div className="pimg"><ProductArt p={p} /></div>
      <div className="info"><span className="name">{p.name}</span><span className="price">{vnd(p.price)}</span></div>
    </button>
  );
}
