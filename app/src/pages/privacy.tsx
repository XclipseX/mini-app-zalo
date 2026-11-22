import React from "react";
import { Page, useNavigate } from "zmp-ui";

// TODO: điền tên Hộ kinh doanh/Công ty theo GPKD và nội dung đầy đủ theo Luật BVDLCN 2025 trước khi gửi duyệt.
export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="topbar"><button className="back" onClick={() => navigate(-1)}>‹</button><h2>Chính sách bảo mật</h2></div>
      <div className="card" style={{ fontSize: 14, lineHeight: 1.6 }}>
        <b>Chính sách bảo mật của Mini App "Niên"</b>
        <p>Đơn vị sở hữu: [Tên HKD/Công ty theo GPKD] – 358 Lê Lai, Thanh Hóa – Hotline 19001068.</p>
        <p><b>Dữ liệu thu thập:</b> Zalo ID, tên hiển thị, số điện thoại (khi đặt món), lịch sử đơn hàng và số tem.</p>
        <p><b>Mục đích:</b> xác nhận đơn, thông báo khi đồ uống sẵn sàng, tích tem đổi quà. Không mua bán dữ liệu.</p>
        <p><b>Quyền của bạn:</b> xem, sửa, rút lại đồng ý và yêu cầu xoá dữ liệu bằng cách liên hệ hotline.</p>
        <p><b>Lưu trữ:</b> trên Google Firebase; lưu trong thời gian bạn còn là thành viên.</p>
      </div>
    </Page>
  );
}
