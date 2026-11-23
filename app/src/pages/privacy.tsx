import LucianAccordion from "../lucian/accordion";
import React from "react";
import { Page, useNavigate } from "zmp-ui";

// TODO: điền tên Hộ kinh doanh/Công ty theo GPKD và nội dung đầy đủ theo Luật BVDLCN 2025 trước khi gửi duyệt.
export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="topbar"><button className="back" aria-label="Quay lại" onClick={() => navigate(-1)}>‹</button><h2>Chính sách bảo mật</h2></div>
      <p className="demo-note" style={{ textAlign: "left", fontSize: 13.5 }}>
        <b>Chính sách bảo mật của Mini App "Niên"</b><br />Đơn vị sở hữu: [Tên HKD/Công ty theo GPKD] – 358 Lê Lai, Thanh Hóa – Hotline 19001068.
      </p>
      <LucianAccordion defaultOpen={0} items={[
        { q: "Niên thu thập dữ liệu gì?", a: "Zalo ID, tên hiển thị, số điện thoại (chỉ khi bạn đặt món), lịch sử đơn hàng và số tem." },
        { q: "Dữ liệu dùng để làm gì?", a: "Xác nhận đơn, báo khi đồ uống sẵn sàng và tích tem đổi quà. Niên không mua bán dữ liệu của bạn." },
        { q: "Quyền của bạn", a: "Bạn có thể xem, sửa, rút lại đồng ý và yêu cầu xoá dữ liệu bằng cách gọi hotline 19001068." },
        { q: "Dữ liệu được lưu ở đâu, bao lâu?", a: "Trên Google Firebase, trong thời gian bạn còn là thành viên." },
      ]} />
    </Page>
  );
}
