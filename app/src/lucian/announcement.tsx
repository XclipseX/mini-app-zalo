// Lucian UX/UI Prompt #073 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#073
// Dải thông báo: tin cuộn lên mỗi 3,8 giây, thanh nhỏ bên phải đếm thời gian; chạm/giữ thì dừng; × để đóng.
import React, { useEffect, useRef, useState } from "react";

export default function LucianAnnouncement({ items, tag = "MỚI" }: { items: [string, string][]; tag?: string }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [closed, setClosed] = useState(false);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const st = useRef({ el: 0, last: 0, paused: false, cur: 0 });
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

  const pause = (v: boolean) => { st.current.paused = v; };
  return (
    <div className={"ux u073 lx-ann" + (closed ? " is-closed" : "")}>
      <div className="u073-ban" {...(closed ? { inert: "" } : {})}><div>
        <div className="u073-bar" role="region" aria-label="Thông báo" aria-roledescription="dải thông báo xoay vòng"
          onPointerEnter={() => pause(true)} onPointerLeave={() => pause(false)} onFocus={() => pause(true)} onBlur={() => pause(false)}>
          <span className="u073-tag">{tag}</span>
          <div className="u073-msgs" aria-live="polite">
            {items.map(([t, s], k) => (
              <div key={k} className={"u073-m" + (k === cur ? " on" : "") + (k === prev && k !== cur ? " up" : "")} aria-hidden={k !== cur}><b>{t}</b><span>{s}</span></div>
            ))}
          </div>
          <span className="u073-segs" aria-hidden="true">{items.map((_, k) => <i key={k} ref={(el) => { bars.current[k] = el; }} />)}</span>
          <button className="u073-b u073-nx" type="button" aria-label="Thông báo tiếp" onClick={() => show(cur + 1)}><svg viewBox="0 0 14 14"><path d="M5 3l4 4-4 4" /></svg></button>
          <button className="u073-b u073-x" type="button" aria-label="Đóng thông báo" onClick={() => setClosed(true)}><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" /></svg></button>
        </div>
      </div></div>
    </div>
  );
}
