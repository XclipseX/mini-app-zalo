// Lucian UX/UI Prompt #052 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#052
// Thẻ thành viên lật 3D: kéo ngang để xoay, thả ra thì bật về mặt gần nhất; bấm để lật. Mặt sau là mã QR tích tem.
import React, { useEffect, useRef, useState } from "react";

interface Props { name: string; code: string; stamps: number; qr: string; onRefresh: () => void }

export default function LucianMemberCard({ name, code, stamps, qr, onRefresh }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLButtonElement>(null);
  const ang = useRef(180); // mở sẵn mặt QR để nhân viên quét nhanh
  const [back, setBack] = useState(true);

  const apply = (a: number) => {
    root.current?.style.setProperty("--ry", a + "deg");
    root.current?.style.setProperty("--sh", (50 + Math.sin((a * Math.PI) / 180) * 60).toFixed(1) + "%");
  };
  const settle = (a: number) => { ang.current = Math.round(a / 180) * 180; apply(ang.current); setBack(Math.abs(ang.current / 180) % 2 === 1); };
  const flip = () => settle(ang.current + 180);

  useEffect(() => {
    const c = card.current!, rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sx = 0, start = 0, moved = false, down = false, lastX = 0, vx = 0;
    const pd = (e: PointerEvent) => { if (e.button !== 0) return; down = true; moved = false; sx = lastX = e.clientX; start = ang.current; vx = 0; try { c.setPointerCapture(e.pointerId); } catch { /* */ } };
    const pm = (e: PointerEvent) => {
      if (!down) return; const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; c.classList.add("drag"); }
      if (!moved) return; vx = e.clientX - lastX; lastX = e.clientX; apply(start + dx * 0.9);
    };
    const up = (e: PointerEvent) => { if (!down) return; down = false; c.classList.remove("drag"); if (!moved) return; settle(start + (e.clientX - sx) * 0.9 + vx * 8); };
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); moved = false; return; } flip(); };
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse" && !rm) root.current?.style.setProperty("--tilt", "8deg"); };
    const leave = () => root.current?.style.setProperty("--tilt", "0deg");
    c.addEventListener("pointerdown", pd); c.addEventListener("pointermove", pm); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    c.addEventListener("click", click); c.addEventListener("pointerenter", enter); c.addEventListener("pointerleave", leave);
    apply(ang.current);
    return () => { /* listener trên phần tử bên trong root tự huỷ theo DOM */ };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={root} className="ux u052">
      <button ref={card} className="u052-card" type="button" aria-label={`Thẻ thành viên, mặt ${back ? "mã QR" : "trước"}. Bấm để lật`}>
        <span className="u052-f u052-front" aria-hidden="true">
          <img className="u052-logo" src="./logo-white.png" alt="" />
          <span className="u052-tier">MEMBER</span>
          <span className="u052-chip" />
          <span className="u052-num">{code}</span>
          <span className="u052-name">{name.toUpperCase()}</span>
          <span className="u052-exp">{stamps}/10 tem</span>
        </span>
        <span className="u052-f u052-back" aria-hidden="true">
          {qr && <span className="u052-qr"><img src={qr} alt="" /></span>}
          <span className="u052-cap">Đưa nhân viên quét để tích tem</span>
        </span>
      </button>
      {back && qr && <img className="sr-only" src={qr} alt="Mã QR thành viên" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />}
      <div className="u052-bar">
        <button className="u052-b" type="button" onClick={flip}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" /></svg>{back ? "Xem thẻ" : "Hiện mã QR"}</button>
        <button className="u052-b" type="button" onClick={onRefresh}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9" /><path d="M19.5 4.5V9H15" /></svg>Làm mới mã</button>
      </div>
    </div>
  );
}
