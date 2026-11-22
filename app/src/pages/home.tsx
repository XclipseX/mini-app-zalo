import React from "react";
import { Page, useNavigate } from "zmp-ui";
import { products } from "../data/menu";
import { useMember } from "../state/member";
import StampCard from "../components/stamp-card";
import ProductCard from "../components/product-card";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, member } = useMember();
  return (
    <Page className="page">
      <div className="hero-pattern" />
      <div className="hero">
        <img className="hero-logo" src="./logo-white.png" alt="Niên" />
        <div className="hero-row">
          {user?.avatar ? <img className="avatar" src={user.avatar} alt="" /> : <div className="avatar" />}
          <div className="grow">
            <b>Chào hàng xóm, {user?.name ?? "bạn"}!</b>
            <small>⭐ Thành viên · {member?.stamps ?? 0} tem</small>
          </div>
          <button className="pill" onClick={() => navigate("/rewards")}>QR tích tem</button>
        </div>
      </div>

      <StampCard stamps={member?.stamps ?? 0} lift />

      <div className="banner">
        <h3>Tích 10 tem<br />Đổi 1 ly</h3>
        <p>Trọn vẹn hương vị theo năm tháng</p>
      </div>

      <div className="section"><h3>Phổ biến</h3><button className="link" onClick={() => navigate("/menu")}>Xem tất cả ›</button></div>
      <div className="hscroll">{products.filter((p) => p.popular).map((p) => <ProductCard key={p.id} p={p} />)}</div>

      <div className="quick">
        <button onClick={() => navigate("/rewards")}><b>Voucher</b><span className="muted">{member?.vouchers.length ?? 0} ưu đãi của tôi</span></button>
        <button onClick={() => navigate("/menu")}><b>Đặt món</b><span className="muted">Nhận tại quán</span></button>
      </div>
    </Page>
  );
}
