import React, { useState } from "react";
import { Page, useNavigate, useSnackbar } from "zmp-ui";
import { itemPrice, useCart, vnd } from "../state/cart";
import { requestPhoneToken, payCheckout } from "../services/zalo";
import { createOrder, PayMethod } from "../services/api";

export default function CartPage() {
  const { items, store, total, setQty, clear } = useCart();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [method, setMethod] = useState<PayMethod>("COD");

  async function checkout() {
    setLoading(true);
    try {
      // Chỉ xin SĐT tại thời điểm đặt hàng, đúng quy định kiểm duyệt của Zalo
      const auth = await requestPhoneToken();
      if (!auth) { openSnackbar({ text: "Cần số điện thoại để quán xác nhận đơn", type: "warning" }); return; }
      // Server tính giá + ký mac → mở Checkout SDK (bắt buộc với app có giá + đặt mua)
      const order = await createOrder({ storeId: store.id, items, total, method, ...auth });
      await payCheckout(order.checkout);
      clear(); setDone(order.orderId);
    } catch (e) {
      openSnackbar({ text: "Đặt món thất bại, vui lòng thử lại", type: "error" });
    } finally { setLoading(false); }
  }

  if (done) return (
    <Page className="page">
      <div className="topbar"><h2>Đặt món thành công</h2></div>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, lineHeight: 1.2, marginBottom: 8 }}>✅</div>
        <h3>Mã đơn {done}</h3>
        <p className="muted">Niên sẽ nhắn tin qua Zalo khi đồ uống sẵn sàng tại {store.name}.</p>
        <p className="muted">{method === "BANK" ? "Bạn đã chọn chuyển khoản – quán sẽ xác nhận khi nhận được tiền." : "Thanh toán tại quầy khi nhận đồ."}</p>
      </div>
      <div style={{ padding: "0 14px" }}><button className="btn" onClick={() => navigate("/", { replace: true })}>Về trang chủ</button></div>
    </Page>
  );

  return (
    <Page className="page">
      <div className="topbar"><button className="back" onClick={() => navigate(-1)}>‹</button><h2>Giỏ hàng</h2></div>
      <div className="store"><div className="label">NHẬN TẠI QUÁN</div><b>{store.name}</b>{store.address}</div>
      <div className="card" style={{ marginTop: 14 }}>
        {items.length === 0 && <div className="muted">Giỏ hàng trống.</div>}
        {items.map((i) => (
          <div key={i.key} className="line">
            <div>
              <b>{i.product.name}</b>
              <div className="muted">{Object.values(i.options).map((o) => o.label).join(" · ")}{i.note && ` · ${i.note}`}</div>
              <span className="price">{vnd(itemPrice(i))}</span>
            </div>
            <div className="qty"><button onClick={() => setQty(i.key, i.qty - 1)}>−</button><b>{i.qty}</b><button onClick={() => setQty(i.key, i.qty + 1)}>+</button></div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className="card">
          <div className="line"><span>Tạm tính</span><b>{vnd(total)}</b></div>
          <div className="label" style={{ marginTop: 8 }}>THANH TOÁN</div>
          {([["COD", "Trả tại quầy khi nhận đồ"], ["BANK", "Chuyển khoản ngân hàng"]] as const).map(([id, label]) => (
            <label key={id} className="line" style={{ cursor: "pointer" }}>
              <span>{label}</span>
              <input type="radio" name="pay" checked={method === id} onChange={() => setMethod(id)} />
            </label>
          ))}
          <div className="muted" style={{ marginTop: 8 }}>Khi bấm đặt món, Zalo sẽ hỏi bạn chia sẻ số điện thoại để quán xác nhận đơn.</div>
        </div>
      )}
      {items.length > 0 && <div className="cta"><button className="btn" disabled={loading} onClick={checkout}>{loading ? "Đang gửi đơn..." : `Đặt món · ${vnd(total)}`}</button></div>}
    </Page>
  );
}
