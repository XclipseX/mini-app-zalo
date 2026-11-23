import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, useNavigate, useSnackbar } from "zmp-ui";
import { products } from "../data/menu";
import { Option } from "../data/types";
import { useCart, vnd } from "../state/cart";

export default function ProductPage() {
  const { id } = useParams();
  const p = products.find((x) => x.id === id)!;
  const navigate = useNavigate();
  const { add } = useCart();
  const { openSnackbar } = useSnackbar();
  const [opts, setOpts] = useState<Record<string, Option>>(
    Object.fromEntries((p.optionGroups ?? []).map((g) => [g.id, g.options[g.id === "sugar" ? 1 : 0]]))
  );
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const unit = p.price + Object.values(opts).reduce((s, o) => s + o.price, 0);

  return (
    <Page className="page">
      <div className="topbar"><button className="back" aria-label="Quay lại" onClick={() => navigate(-1)}>‹</button><h2>Chi tiết món</h2></div>
      <div className="detail-img"><span style={{ background: p.color }} /></div>
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
        <div className="row" style={{ marginTop: 16 }}>
          <span className="opt-title" style={{ margin: 0 }}>Số lượng</span>
          <div className="qty"><button aria-label="Giảm số lượng" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button aria-label="Tăng số lượng" onClick={() => setQty(qty + 1)}>+</button></div>
        </div>
      </div>
      <div className="cta">
        <button className="btn" onClick={() => { add(p, opts, note.trim(), qty); openSnackbar({ text: "Đã thêm vào giỏ", type: "success" }); navigate(-1); }}>
          Thêm vào giỏ · {vnd(unit * qty)}
        </button>
      </div>
    </Page>
  );
}
