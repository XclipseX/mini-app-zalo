// Màn hình nhân viên: quét QR thành viên → cộng tem / dùng voucher.
// Quyền staff kiểm tra ở server (collection staff/{zaloId}, active=true). MOCK: dùng QR giả của member demo.
import React, { useState } from "react";
import { Page, useNavigate } from "zmp-ui";
import { useToast } from "../lucian/toast";
import { addStamp, lookupMember, LookupResult, mockQr, redeemVoucher } from "../services/api";
import { getToken, MOCK, scanQr } from "../services/zalo";
import { useMember } from "../state/member";

export default function StaffPage() {
  const navigate = useNavigate();
  const { openSnackbar } = useToast();
  const { refresh } = useMember();
  const [qr, setQr] = useState("");
  const [info, setInfo] = useState<LookupResult | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [busy, setBusy] = useState(false);

  const fail = (e: unknown) => openSnackbar({ text: e instanceof Error ? e.message : "Có lỗi, thử lại", type: "error" });

  async function run<T>(fn: () => Promise<T>) {
    setBusy(true);
    try { return await fn(); } catch (e) { fail(e); } finally { setBusy(false); }
  }

  const load = (code: string) => run(async () => {
    const r = await lookupMember(await getToken(), code);
    setQr(code); setInfo(r); setCount(1);
  });

  const scan = () => run(async () => {
    const code = (await scanQr()) ?? (MOCK ? mockQr() : null);
    if (!code) throw new Error("Không đọc được mã QR");
    const r = await lookupMember(await getToken(), code);
    setQr(code); setInfo(r); setCount(1);
  });

  const doStamp = () => run(async () => {
    const r = await addStamp(await getToken(), qr, count);
    openSnackbar({ text: `+${count} tem` + (r.newVouchers ? ` · tặng ${r.newVouchers} ly miễn phí 🎉` : ""), type: "success" });
    await load(qr);
    if (MOCK) refresh();
  });

  const doRedeem = (id: string, title: string) => run(async () => {
    await redeemVoucher(await getToken(), qr, id);
    openSnackbar({ text: `Đã dùng: ${title}`, type: "success" });
    await load(qr);
    if (MOCK) refresh();
  });

  const reset = () => { setQr(""); setInfo(null); };

  return (
    <Page className="page">
      <div className="topbar"><img src="./logo-dark.png" alt="Niên" style={{ height: 22 }} /><h2>Nhân viên</h2></div>

      <div style={{ padding: "0 14px" }}><button className="btn ghost" onClick={() => navigate("/staff/orders")}>Đơn hàng chi nhánh →</button></div>

      <div className="card" style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 17 }}>Quét mã thành viên</h3>
        <div className="muted">Khách mở tab Rewards → đưa mã QR</div>
        <button className="btn" style={{ marginTop: 12 }} disabled={busy} onClick={scan}>{busy ? "Đang xử lý…" : "Quét QR"}</button>
        {MOCK && <p className="muted" style={{ marginTop: 8 }}>Chế độ demo: tự dùng mã của thành viên mẫu.</p>}
      </div>

      {info && (
        <>
          <div className="card">
            <div className="line"><span>Khách</span><b>{info.name || "Thành viên"}</b></div>
            <div className="line"><span>Tem hiện có</span><b>{info.stamps}/10</b></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
              <span>Số tem</span>
              <button className="btn ghost" style={{ width: 44, padding: 10 }} disabled={busy || count <= 1} onClick={() => setCount(count - 1)}>−</button>
              <b style={{ minWidth: 20, textAlign: "center" }}>{count}</b>
              <button className="btn ghost" style={{ width: 44, padding: 10 }} disabled={busy || count >= 5} onClick={() => setCount(count + 1)}>+</button>
            </div>
            <button className="btn" disabled={busy} onClick={doStamp}>Cộng {count} tem</button>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 17 }}>Voucher của khách</h3>
            {info.vouchers.length === 0 && <p className="muted">Không có voucher còn hạn.</p>}
            {info.vouchers.map((v) => (
              <div key={v.id} className="voucher">
                <div className="tag">{v.badge}</div>
                <div className="body" style={{ flex: 1 }}><b>{v.title}</b><br /><span className="muted">HSD: {v.expires}</span></div>
                <button className="link" style={{ padding: "0 12px" }} disabled={busy}
                  onClick={() => { if (confirmId === v.id) { setConfirmId(null); doRedeem(v.id, v.title); } else setConfirmId(v.id); }}>
                  {confirmId === v.id ? "Xác nhận?" : "Dùng"}</button>
              </div>
            ))}
          </div>
          <p className="demo-note"><button className="link" onClick={reset}>Khách tiếp theo</button></p>
        </>
      )}
      <p className="demo-note"><button className="link" onClick={() => navigate("/rewards")}>← Về Rewards</button></p>
    </Page>
  );
}
