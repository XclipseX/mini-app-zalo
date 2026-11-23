// Lucian UX/UI Prompt #353 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#353
// Thẻ 10 tem: số tem lấy từ server (props), con dấu đóng xuống khi số tem tăng; đủ 10 thì lật ra "1 ly miễn phí".
import React, { useEffect, useRef, useState } from "react";

const CUP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const INK = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="40 2 30 3 50 2"/><circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M20 26h16v7a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z" fill="currentColor" opacity=".9"/><path d="M36 28h3a3.5 3.5 0 0 1 0 7h-3" fill="none" stroke="currentColor" stroke-width="2.4"/><text x="30" y="17" text-anchor="middle" font-size="6" font-weight="900" fill="currentColor" font-family="system-ui" letter-spacing="1">NIÊN</text></svg>';

interface Props {
  stamps: number;          // 0–9 (server tự trừ 10 và tạo voucher khi đủ)
  onDemoStamp?: () => void; // chỉ có ở chế độ mock
}

export default function LucianStampCard({ stamps, onDemoStamp }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const stp = useRef<SVGSVGElement>(null);
  const slots = useRef<HTMLDivElement[]>([]);
  const shown = useRef(stamps);
  const [count, setCount] = useState(stamps);
  const [done, setDone] = useState(false);

  // Tạo 10 ô một lần (giữ nguyên markup gốc của element)
  useEffect(() => {
    const gd = grid.current!;
    gd.innerHTML = "";
    slots.current = Array.from({ length: 10 }, (_, i) => {
      const sl = document.createElement("div");
      sl.className = "u353-sl";
      sl.innerHTML = CUP + '<span class="u353-ink" style="--r:' + (((i * 37) % 34) - 17) + 'deg">' + INK + "</span>";
      if (i < stamps) sl.querySelector(".u353-ink")!.classList.add("is-on");
      gd.appendChild(sl);
      return sl;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Số tem từ server thay đổi → đóng dấu các ô mới
  useEffect(() => {
    const timers: number[] = [];
    const anims: Animation[] = [];
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = shown.current;
    const target = stamps < from ? 10 : stamps; // giảm = vừa đủ 10 và server đã reset
    const stampAt = (i: number, delay: number) => {
      timers.push(window.setTimeout(() => {
        const sl = slots.current[i], el = root.current, s = stp.current;
        if (!sl || !el || !s) return;
        const ink = sl.querySelector(".u353-ink")!;
        const land = () => { ink.classList.add("is-on"); setCount(i + 1); if (i + 1 >= 10) timers.push(window.setTimeout(() => setDone(true), rm ? 0 : 450)); };
        if (rm || !s.animate) { land(); return; }
        const r = sl.getBoundingClientRect(), rb = el.getBoundingClientRect(), k = el.offsetWidth / (rb.width || 1);
        const x = (r.left - rb.left) * k + (r.width * k) / 2 - 27, y = (r.top - rb.top) * k + (r.height * k) / 2 - 64;
        s.style.opacity = "1";
        const a = s.animate([
          { transform: `translate(${x + 20}px,${y - 60}px) scale(1.25) rotate(8deg)`, opacity: 0 },
          { transform: `translate(${x}px,${y - 10}px) scale(1.1)`, opacity: 1, offset: 0.4 },
          { transform: `translate(${x}px,${y + 2}px) scale(1.04,.92)`, offset: 0.55 },
          { transform: `translate(${x}px,${y - 50}px) scale(1.15)`, opacity: 1, offset: 0.85 },
          { transform: `translate(${x - 10}px,${y - 70}px) scale(1.2)`, opacity: 0 },
        ], { duration: 560, easing: "ease-in-out" });
        a.onfinish = () => { s.style.opacity = "0"; };
        anims.push(a);
        timers.push(window.setTimeout(land, 300));
      }, delay));
    };
    for (let i = from, d = 0; i < target; i++, d += 650) stampAt(i, d);
    shown.current = stamps;
    return () => { timers.forEach(clearTimeout); anims.forEach((a) => a.cancel()); };
  }, [stamps]);

  // Bấm "Thẻ mới" sau khi nhận ly miễn phí → hiện lại số tem hiện tại
  const newCard = () => {
    setDone(false);
    slots.current.forEach((sl, i) => sl.querySelector(".u353-ink")!.classList.toggle("is-on", i < stamps));
    setCount(stamps);
  };

  return (
    <div ref={root} className={"ux u353" + (done ? " is-done" : "")}>
      <div className="u353-cd"><div className="u353-in">
        <div className="u353-fr"><div className="u353-tt"><b>Niên Coffee</b><span>Tích 10 tem · Tặng 1 ly</span></div><div ref={grid} className="u353-gd" /></div>
        <div className="u353-bk" aria-live="polite">
          <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M14 22h28v16a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z" fill="#fff" stroke="#3E2A1E" strokeWidth="3" /><path d="M42 26h4a6 6 0 0 1 0 12h-4" fill="none" stroke="#3E2A1E" strokeWidth="3" /><path d="M22 8q4 4 0 8M30 6q4 4 0 8" stroke="#C2410C" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
          <b>1 ly miễn phí</b><span>Đã thêm vào Voucher của bạn</span>
        </div>
      </div></div>
      <svg ref={stp} className="u353-stp" viewBox="0 0 54 70" aria-hidden="true"><rect x="19" y="0" width="16" height="30" rx="7" fill="#16381F" /><rect x="10" y="28" width="34" height="14" rx="4" fill="#0A6836" /><rect x="6" y="40" width="42" height="12" rx="3" fill="#E76433" /></svg>
      <div className="u353-ft">
        <span className="u353-n" aria-live="polite">{count}/10 tem</span>
        <span className="u353-bar"><i style={{ width: `${count * 10}%` }} /></span>
        {done
          ? <button type="button" className="u353-go" onClick={newCard}>Thẻ mới</button>
          : onDemoStamp
            ? <button type="button" className="u353-go" onClick={onDemoStamp}>Demo +1 tem</button>
            : <span className="u353-hint">Đưa mã QR cho nhân viên</span>}
      </div>
    </div>
  );
}
