// Lucian UX/UI Prompt #041 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#041
// Thanh tab dưới có khấc: bong bóng tròn trượt (lò xo) tới tab đang chọn, icon nhấc lên, nhãn hiện ra.
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "zmp-ui";
import { useCart } from "../state/cart";

const TABS = [
  { path: "/", label: "Home", icon: <path d="M4 11l8-6.5 8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" /> },
  { path: "/menu", label: "Menu", icon: <path d="M5 8h12v5a6 6 0 0 1-12 0zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M11 2v3M14 2v3" /> },
  { path: "/rewards", label: "Rewards", icon: <path d="M4 10h16v10H4zM2 7h20v3H2zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" /> },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const root = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const sim = useRef({ x: 0, v: 0, target: 0, raf: 0, init: false });
  const cur = TABS.findIndex((t) => t.path === pathname);

  useEffect(() => {
    const el = root.current, b = btns.current[cur];
    if (!el || !b) return;
    const s = sim.current;
    s.target = (b.parentElement as HTMLElement).offsetLeft + b.offsetWidth / 2;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!s.init || rm) { s.x = s.target; s.init = true; el.style.setProperty("--x", s.x + "px"); return; }
    const step = () => {
      const a = (s.target - s.x) * 0.16 - s.v * 0.42;
      s.v += a; s.x += s.v;
      el.style.setProperty("--x", s.x.toFixed(2) + "px");
      if (Math.abs(s.target - s.x) > 0.3 || Math.abs(s.v) > 0.3) s.raf = requestAnimationFrame(step);
      else { s.x = s.target; s.v = 0; el.style.setProperty("--x", s.x + "px"); s.raf = 0; }
    };
    if (!s.raf) s.raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; };
  }, [cur]);

  if (cur < 0) return null;
  return (
    <nav className="lx-nav">
      <div ref={root} className="ux u041">
        <span className="u041-shadow" aria-hidden="true" />
        <div className="u041-bar" aria-hidden="true" />
        <span className="u041-bub" aria-hidden="true" />
        <ul className="u041-tabs" role="tablist" aria-label="Điều hướng chính">
          {TABS.map((t, i) => (
            <li role="none" key={t.path}>
              <button ref={(el) => { btns.current[i] = el; }} className="u041-tab" type="button" role="tab" aria-selected={i === cur} tabIndex={i === cur ? 0 : -1}
                onClick={() => i !== cur && navigate(t.path, { animate: false })}
                onKeyDown={(e) => {
                  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (d) { e.preventDefault(); navigate(TABS[(i + d + TABS.length) % TABS.length].path, { animate: false }); }
                }}>
                <span className="u041-ic" aria-hidden="true"><svg viewBox="0 0 24 24">{t.icon}</svg></span>
                {t.path === "/menu" && count > 0 && <em className="u041-bd" aria-label={`${count} món trong giỏ`}>{count}</em>}
                <span className="u041-lab">{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
