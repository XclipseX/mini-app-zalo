import React, { createContext, useContext, useMemo, useState } from "react";
import { CartItem, Option, Product, Store } from "../data/types";
import { stores } from "../data/menu";

interface CartCtx {
  items: CartItem[]; store: Store; count: number; total: number;
  add: (p: Product, options: Record<string, Option>, note: string, qty: number) => void;
  setQty: (key: string, qty: number) => void; clear: () => void;
}
const Ctx = createContext<CartCtx>(null!);

export const itemPrice = (i: CartItem) =>
  (i.product.price + Object.values(i.options).reduce((s, o) => s + o.price, 0)) * i.qty;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo<CartCtx>(() => ({
    items, store: stores[0],
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + itemPrice(i), 0),
    add: (product, options, note, qty) => setItems((prev) => {
      const key = product.id + "|" + Object.values(options).map((o) => o.id).join(",") + "|" + note;
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, product, options, note, qty }];
    }),
    setQty: (key, qty) => setItems((prev) => prev.flatMap((i) => (i.key !== key ? [i] : qty > 0 ? [{ ...i, qty }] : []))),
    clear: () => setItems([]),
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
export const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
