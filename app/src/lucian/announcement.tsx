// Lucian UX/UI Prompt #073 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#073
// Dải thông báo: tin cuộn lên mỗi 3,8 giây, thanh nhỏ bên phải đếm thời gian.
// Điều chỉnh cho dùng một tay: chạm bất kỳ đâu trên dải để sang tin kế, vuốt ngang để đóng, nút × bên trái.
import React, { useEffect, useRef, useState } from "react";

export default function LucianAnnouncement({ items, tag = "MỚI" }: { items: [string, string][]; tag?: string }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [closed, setClosed] = useState(false);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const st = useRef({ el: 0, last: 0, paused: false, cur: 0 });
  const drag = useRef({ x0: 0, dx: 0, on: false, moved: false });
  const DUR = 3800;

  const show = (i: number) => {
    const n = (i + items.length) % items.length;
    setPrev(st.current.cur); st.current.cur = n; st.current.el = 0; setCur(n);
    bars.current.forEach((b, k) => b?.style.setProperty("--f", k < n ? "1" : "0"));
    setTimeout(() => setPrev(null), 600);
  };

  useEffect(() => {
    if (closed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0; st.current.last = performance.now();
    const loop = (now: number) => {
      const s = st.current, dt = now - s.last; s.last = now;
      if (!s.paused) {
        s.el += dt;
        bars.current[s.cur]?.style.setProperty("--f", Math.min(1, s.el / DUR).toFixed(3));
        if (s.el >= DUR) show(s.cur + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [closed]); // eslint-disable-line react-hooks/exhaustive-deps

  const setX = (x: number) => { if (bar.current) { bar.current.style.transform = x ? `translateX(${x}px)` : ""; bar.current.style.opacity = x ? String(Math.max(0.3, 1 - Math.abs(x) / 260)) : ""; } };
  return (
    <div className={"ux u073 lx-ann" + (closed ? " is-closed" : "")}>
      <div className="u073-ban" {...(closed ? { inert: "" } : {})}><div>
        <div ref={bar} className="u073-bar" role="region" aria-label="Thông báo. Chạm để xem tin tiếp, vuốt ngang để đóng" aria-roledescription="dải thông báo xoay vòng"
          onPointerDown={(e) => { if ((e.target as HTMLElement).closest("button")) return; drag.current = { x0: e.clientX, dx: 0, on: true, moved: false }; st.current.paused = true; }}
          onPointerMove={(e) => { const d = drag.current; if (!d.on) return; d.dx = e.clientX - d.x0; if (Math.abs(d.dx) > 6) d.moved = true; if (d.moved) setX(d.dx); }}
          onPointerUp={() => {
            const d = drag.current; if (!d.on) return; d.on = false; st.current.paused = false;
            if (Math.abs(d.dx) > 90) { setX(d.dx > 0 ? 400 : -400); setTimeout(() => { setClosed(true); setX(0); }, 220); return; }
            setX(0); if (!d.moved) show(st.current.cur + 1);
          }}
          onPointerCancel={() => { drag.current.on = false; st.current.paused = false; setX(0); }}>
          <button className="u073-b u073-x" type="button" aria-label="Đóng thông báo" onClick={() => setClosed(true)}><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" /></svg></button>
          <span className="u073-tag">{tag}</span>
          <div className="u073-msgs" aria-live="polite">
            {items.map(([t, s], k) => (
              <div key={k} className={"u073-m" + (k === cur ? " on" : "") + (k === prev && k !== cur ? " up" : "")} aria-hidden={k !== cur}><b>{t}</b><span>{s}</span></div>
            ))}
          </div>
          <span className="u073-segs" aria-hidden="true">{items.map((_, k) => <i key={k} ref={(el) => { bars.current[k] = el; }} />)}</span>
        </div>
      </div></div>
    </div>
  );
}
