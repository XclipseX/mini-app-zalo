import LucianQuantityStepper from "../lucian/quantity-stepper";
import { flyToCart } from "../lucian/fly-to-cart";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, useNavigate } from "zmp-ui";
import { useToast } from "../lucian/toast";
import { products } from "../data/menu";
import { Option } from "../data/types";
import { useCart, vnd } from "../state/cart";

export default function ProductPage() {
  const { id } = useParams();
  const p = products.find((x) => x.id === id)!;
  const navigate = useNavigate();
  const { add, count } = useCart();
  const art = useRef<HTMLSpanElement>(null);
  const cartBtn = useRef<HTMLButtonElement>(null);
  const [adding, setAdding] = useState(false);
  const { openSnackbar } = useToast();
  const [opts, setOpts] = useState<Record<string, Option>>(
    Object.fromEntries((p.optionGroups ?? []).map((g) => [g.id, g.options[g.id === "sugar" ? 1 : 0]]))
  );
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const unit = p.price + Object.values(opts).reduce((s, o) => s + o.price, 0);

  return (
    <Page className="page">
      <div className="topbar"><button className="back" aria-label="Quay lại" onClick={() => navigate(-1)}>‹</button><h2>Chi tiết món</h2></div>
      <div className="detail-img"><span ref={art} style={{ background: p.color }} /></div>
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 22 }}>{p.name}</h2>
        {p.enName && <div className="muted">{p.enName}</div>}
        {p.description && <div className="muted">{p.description}</div>}
        <div className="price" style={{ fontSize: 18, marginTop: 6 }}>{vnd(p.price)}</div>
        {(p.optionGroups ?? []).map((g) => (
          <div key={g.id}>
            <div className="opt-title">{g.name}</div>
            <div className="opts">
              {g.options.map((o) => (
                <button key={o.id} className={"opt" + (opts[g.id]?.id === o.id ? " on" : "")} onClick={() => setOpts({ ...opts, [g.id]: o })}>
                  {o.label}{o.price ? ` +${vnd(o.price)}` : ""}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="opt-title">Ghi chú</div>
        <textarea rows={2} maxLength={120} placeholder="Ví dụ: ít ngọt, mang về..." value={note} onChange={(e) => setNote(e.target.value)} aria-label="Ghi chú cho món" />
        <div className="counter">{note.length}/120</div>
        <div className="opt-title">Số lượng</div>
        <LucianQuantityStepper value={qty} onChange={setQty} unitPrice={unit} />
      </div>
      <div className="cta lx-cta-row">
        {/* Nút giỏ ở dưới, bên trái: dễ chạm bằng ngón cái khi cầm máy một tay */}
        <button ref={cartBtn} type="button" className="ux u442-cart lx-bottom" aria-label={`Xem giỏ hàng, ${count} món`} onClick={() => navigate("/cart")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.1 10.3a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.2L20 8H6.2" /><circle cx="9.5" cy="19.5" r="1.4" /><circle cx="16.5" cy="19.5" r="1.4" /></svg>
          {count > 0 && <span className="u442-bd" aria-hidden="true">{count}</span>}
        </button>
        <button className="btn" disabled={adding} onClick={() => {
          setAdding(true);
          flyToCart(art.current, cartBtn.current, `<span style="display:block;width:40px;height:40px;border-radius:50%;background:${p.color}"></span>`, () => {
            add(p, opts, note.trim(), qty);
            openSnackbar({ text: "Đã thêm vào giỏ", type: "success" });
            setTimeout(() => navigate(-1), 650);
          });
        }}>
          Thêm vào giỏ · {vnd(unit * qty)}
        </button>
      </div>
    </Page>
  );
}
