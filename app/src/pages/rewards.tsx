import LucianSkeleton from "../lucian/skeleton";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Page, useNavigate } from "zmp-ui";
import { useToast } from "../lucian/toast";
import { useMember } from "../state/member";
import { MOCK, getToken } from "../services/zalo";
import { isStaff } from "../services/api";
import LucianStampCard from "../lucian/stamp-card";

export default function RewardsPage() {
  const { member, refresh, addStampDemo } = useMember();
  const [qr, setQr] = useState("");
  const navigate = useNavigate();
  const { openSnackbar } = useToast();
  const [staff, setStaff] = useState(false);
  useEffect(() => { getToken().then(isStaff).then(setStaff).catch(() => setStaff(false)); }, []);
  // QR do server ký (getMember → member.qr), hạn 5 phút → tự làm mới mỗi 4 phút khi đang mở trang
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4 * 60 * 1000);
    return () => clearInterval(t);
  }, [refresh]);
  useEffect(() => {
    if (!member?.qr) { setQr(""); return; }
    QRCode.toDataURL(member.qr, { margin: 1, width: 360, color: { dark: "#16381F", light: "#ffffff" } }).then(setQr);
  }, [member?.qr]);

  return (
    <Page className="page">
      <div className="topbar"><img src="./logo-dark.png" alt="Niên" style={{ height: 22 }} /><h2>Rewards</h2></div>
      {member && qr ? (
        <div className="card qr-card">
          <img className="qr" src={qr} alt="Mã QR thành viên" />
          <div className="muted">Đưa nhân viên quét để tích tem</div>
          <button className="ux u052-b qr-refresh" type="button" onClick={refresh}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9" /><path d="M19.5 4.5V9H15" /></svg>Làm mới mã</button>
        </div>
      ) : (
        <LucianSkeleton label="Đang tải mã thành viên" rows={[["100%", 200], ["60%", 14]]} />
      )}
      <LucianStampCard stamps={member?.stamps ?? 0}
        onDemoStamp={MOCK ? async () => { await addStampDemo(); openSnackbar({ text: "+1 tem (giả lập nhân viên quét)", type: "success" }); } : undefined} />
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
      <p className="demo-note footer-links"><button className="link" onClick={() => navigate("/privacy")}>Chính sách bảo mật</button>{staff && <><button className="link" onClick={() => navigate("/staff")}>Dành cho nhân viên</button></>}</p>
    </Page>
  );
}
