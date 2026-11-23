// Nhân viên xem đơn của chi nhánh: đang pha → sẵn sàng → đã giao, xác nhận đã nhận tiền chuyển khoản.
// Server (listOrders/updateOrderStatus) kiểm tra quyền staff + chi nhánh. MOCK: đơn lưu localStorage.
import LucianPillTabs from "../lucian/pill-tabs";
import LucianSkeleton from "../lucian/skeleton";
import React, { useEffect, useRef, useState } from "react";
import { enableChime, playChime } from "../services/chime";
import { Page, useNavigate } from "zmp-ui";
import { useToast } from "../lucian/toast";
import { listOrders, mockIncomingOrder, NEXT_STATUS, OrderStatus, StaffOrder, updateOrderStatus } from "../services/api";
import { getToken, MOCK } from "../services/zalo";
import { vnd } from "../state/cart";

const LABEL: Record<OrderStatus, string> = { pending: "Mới", making: "Đang pha", ready: "Sẵn sàng", done: "Đã giao", cancelled: "Đã huỷ" };
const ACTION: Partial<Record<OrderStatus, string>> = { making: "Bắt đầu pha", ready: "Báo sẵn sàng", done: "Đã giao khách" };
const FILTERS: { id: "active" | OrderStatus; label: string }[] = [
  { id: "active", label: "Đang xử lý" }, { id: "pending", label: "Mới" }, { id: "making", label: "Đang pha" },
  { id: "ready", label: "Sẵn sàng" }, { id: "done", label: "Đã giao" }, { id: "cancelled", label: "Đã huỷ" },
];
const time = (ms: number) => ms ? new Date(ms).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

/** 0912345678 → 0912***678 (nhân viên vẫn gọi được khi cần qua chi tiết đơn ở server) */
const maskPhone = (p: string) => (p.length >= 7 ? p.slice(0, 4) + "***" + p.slice(-3) : p);

export default function StaffOrdersPage() {
  const navigate = useNavigate();
  const { openSnackbar } = useToast();
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [filter, setFilter] = useState<"active" | OrderStatus>("active");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Âm báo: bật theo từng máy (nhớ lựa chọn); kêu khi có đơn mới và nhắc lại mỗi 15 giây tới khi đơn được "Bắt đầu pha"
  const [alertOn, setAlertOn] = useState(() => { try { return localStorage.getItem("nien-staff-alert") === "1"; } catch { return false; } });
  const [armed, setArmed] = useState(false); // đã chạm để mở khoá âm thanh trong phiên này chưa
  const seen = useRef<Set<string> | null>(null);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const fail = (e: unknown) => openSnackbar({ text: e instanceof Error ? e.message : "Có lỗi, thử lại", type: "error" });

  async function load() {
    try {
      const list = await listOrders(await getToken());
      const fresh = list.filter((o) => o.status === "pending" && seen.current && !seen.current.has(o.id));
      seen.current = new Set(list.map((o) => o.id));
      setOrders(list);
      if (fresh.length) {
        playChime();
        openSnackbar({ text: fresh.length === 1 ? `Đơn mới ${fresh[0].id}` : `${fresh.length} đơn mới`, type: "success" });
      }
    } catch (e) { fail(e); } finally { setLoading(false); }
  }
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, []);
  // Nhắc lại khi vẫn còn đơn "Mới" chưa ai nhận
  useEffect(() => {
    if (!alertOn || !armed || pendingCount === 0) return;
    const t = setInterval(playChime, 15000);
    return () => clearInterval(t);
  }, [alertOn, armed, pendingCount]);
  useEffect(() => { document.title = pendingCount ? `(${pendingCount}) Đơn mới – Niên` : "Niên"; return () => { document.title = "Niên"; }; }, [pendingCount]);

  const toggleAlert = () => {
    if (alertOn && armed) { setAlertOn(false); try { localStorage.setItem("nien-staff-alert", "0"); } catch { /* */ } return; }
    const ok = enableChime();
    setArmed(ok); setAlertOn(true);
    try { localStorage.setItem("nien-staff-alert", "1"); } catch { /* */ }
    if (ok) { playChime(); openSnackbar({ text: "Đã bật âm báo đơn mới", type: "success" }); }
    else openSnackbar({ text: "Máy này không phát được âm thanh", type: "warning" });
  };

  async function change(o: StaffOrder, c: { status?: OrderStatus; paid?: boolean }, key: string) {
    if (confirm !== key) { setConfirm(key); return; }
    setConfirm(null); setBusy(o.id);
    try {
      const u = await updateOrderStatus(await getToken(), o.id, c);
      setOrders((all) => all.map((x) => (x.id === o.id ? { ...x, status: u.status, paymentStatus: u.paymentStatus } : x)));
      openSnackbar({ text: c.paid ? `Đã xác nhận nhận tiền ${o.id}` : `${o.id}: ${LABEL[u.status]}`, type: "success" });
    } catch (e) { fail(e); } finally { setBusy(null); }
  }

  const shown = orders.filter((o) => filter === "active" ? !!NEXT_STATUS[o.status] : o.status === filter);

  return (
    <Page className="page">
      <div className="topbar"><img src="./logo-dark.png" alt="Niên" style={{ height: 22 }} /><h2>Đơn hàng</h2></div>
      <LucianPillTabs label="Lọc đơn" value={filter} onChange={(id) => setFilter(id as "active" | OrderStatus)}
        items={FILTERS.map((f) => ({ id: f.id, label: f.label + (f.id === "active" ? ` (${orders.filter((o) => NEXT_STATUS[o.status]).length})` : "") }))} />
      {pendingCount > 0 && <div className="alert-strip" role="status">🔔 {pendingCount} đơn mới đang chờ – bấm "Bắt đầu pha" để nhận đơn</div>}

      {loading && shown.length === 0 && [0, 1].map((k) => <LucianSkeleton key={k} label="Đang tải đơn" rows={[["40%", 16], ["60%", 12], ["90%", 12], ["70%", 12], ["100%", 44]]} />)}
      {!loading && shown.length === 0 && <p className="demo-note">Không có đơn.</p>}

      {shown.map((o) => {
        const next = NEXT_STATUS[o.status];
        const bankUnpaid = o.paymentMethod === "BANK" && o.paymentStatus !== "paid";
        return (
          <div key={o.id} className="card">
            <div className="line"><b>{o.id}</b><span>{time(o.createdAt)} · <b>{LABEL[o.status]}</b></span></div>
            <div className="line"><span>{o.name || "Khách"}{o.phone ? ` · ${maskPhone(o.phone)}` : ""}</span></div>
            {o.items.map((i, k) => (
              <div key={k} className="line" style={{ display: "block" }}>
                <b>{i.qty}× {i.name}</b>
                {Object.values(i.options).length > 0 && <span className="muted"> · {Object.values(i.options).join(", ")}</span>}
                {i.note && <div className="muted">Ghi chú: {i.note}</div>}
              </div>
            ))}
            <div className="line"><span>{o.paymentMethod === "BANK" ? "Chuyển khoản" : "Trả tại quầy"} · {o.paymentStatus === "paid" ? "đã thanh toán" : "chưa thanh toán"}</span><b>{vnd(o.total)}</b></div>
            <div className="actions">
            {bankUnpaid && o.status !== "cancelled" && (
              <button className="btn ghost" style={{ marginTop: 10 }} disabled={busy === o.id} onClick={() => change(o, { paid: true }, o.id + ":paid")}>
                {confirm === o.id + ":paid" ? "Chắc chắn đã nhận tiền?" : "Xác nhận đã nhận chuyển khoản"}</button>
            )}
            {next && (
              <button className="btn" style={{ marginTop: 10 }} disabled={busy === o.id} onClick={() => change(o, { status: next }, o.id + ":" + next)}>
                {confirm === o.id + ":" + next ? "Bấm lần nữa để xác nhận" : ACTION[next]}</button>
            )}
            {next && (
              <button className="btn ghost" style={{ marginTop: 10, color: "#b3261e" }} disabled={busy === o.id} onClick={() => change(o, { status: "cancelled" }, o.id + ":cancel")}>
                {confirm === o.id + ":cancel" ? "Chắc chắn huỷ đơn?" : "Huỷ đơn"}</button>
            )}
            </div>
          </div>
        );
      })}
      {/* Nút âm báo ở góc dưới bên trái: dễ chạm bằng ngón cái */}
      <div className="alert-dock">
        <button type="button" className={"alert-btn" + (alertOn && armed ? " on" : "")} onClick={toggleAlert} aria-pressed={alertOn && armed}>
          {alertOn && armed ? "🔔 Âm báo: Bật" : alertOn ? "🔔 Chạm để bật âm báo" : "🔕 Âm báo: Tắt"}
        </button>
        {MOCK && <button type="button" className="alert-btn ghost" onClick={() => { mockIncomingOrder(); load(); }}>Demo: có đơn mới</button>}
      </div>
      <p className="demo-note"><button className="link" onClick={load}>Tải lại</button> · <button className="link" onClick={() => navigate("/staff")}>← Quét QR</button></p>
    </Page>
  );
}
