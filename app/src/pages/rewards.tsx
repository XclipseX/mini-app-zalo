import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Page, useNavigate, useSnackbar } from "zmp-ui";
import { useMember } from "../state/member";
import { MOCK } from "../services/zalo";
import StampCard from "../components/stamp-card";

export default function RewardsPage() {
  const { user, member, addStampDemo } = useMember();
  const [qr, setQr] = useState("");
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  useEffect(() => {
    // Bản thật: server cấp mã ngắn hạn có chữ ký để chống chụp màn hình dùng lại
    QRCode.toDataURL(`NIEN:${user?.id ?? "guest"}`, { margin: 1, width: 360, color: { dark: "#16381F", light: "#ffffff" } }).then(setQr);
  }, [user?.id]);

  return (
    <Page className="page">
      <div className="topbar"><img src="/logo-dark.png" alt="Niên" style={{ height: 22 }} /><h2>Rewards</h2></div>
      <div className="card" style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 17 }}>Mã thành viên</h3>
        <div className="muted">Đưa nhân viên quét để tích tem</div>
        {qr && <img className="qr" src={qr} alt="QR thành viên" />}
        {MOCK && <button className="btn ghost" onClick={async () => { await addStampDemo(); openSnackbar({ text: "+1 tem (giả lập nhân viên quét)", type: "success" }); }}>Demo: giả lập quét +1 tem</button>}
      </div>
      <StampCard stamps={member?.stamps ?? 0} />
      <div className="card">
        <h3 style={{ fontSize: 17 }}>Voucher của tôi</h3>
        {member?.vouchers.map((v) => (
          <div key={v.id} className="voucher"><div className="tag">{v.badge}</div><div className="body"><b>{v.title}</b><br /><span className="muted">HSD: {v.expires}</span></div></div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontSize: 17 }}>Lịch sử tem</h3>
        {member?.history.slice(0, 5).map((h, i) => <div key={i} className="line"><span>{h.text}</span><span className="muted">{h.date}</span></div>)}
      </div>
      <p className="demo-note"><button className="link" onClick={() => navigate("/privacy")}>Chính sách bảo mật</button></p>
    </Page>
  );
}
