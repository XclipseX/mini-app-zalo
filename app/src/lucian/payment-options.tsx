// Lucian UX/UI Prompt #015 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#015
// Chọn phương thức thanh toán: khung trượt tới lựa chọn, chấm tròn bật vào; phím mũi tên để đổi.
import React, { useLayoutEffect, useRef } from "react";

export interface PayOption { id: string; title: string; note: string; badge?: string; icon: "store" | "bank"; color: string }

const ICONS = {
  store: <svg viewBox="0 0 24 24"><path d="M4 10h16l-1-5H5zM5 10v9h14v-9M10 19v-5h4v5" /></svg>,
  bank: <svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v7M10 10v7M14 10v7M19 10v7M3 20h18" /></svg>,
};

export default function LucianPaymentOptions({ options, value, onChange }: { options: PayOption[]; value: string; onChange: (id: string) => void }) {
  const frame = useRef<HTMLSpanElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const first = useRef(true);

  useLayoutEffect(() => {
    const o = refs.current[value], f = frame.current;
    if (!o || !f) return;
    if (first.current) { f.style.transition = "none"; }
    f.style.top = o.offsetTop + "px"; f.style.height = o.offsetHeight + "px";
    if (first.current) { first.current = false; requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = ""; })); }
  }, [value, options.length]);

  return (
    <div className="ux u015">
      <div className="u015-grp" role="radiogroup" aria-label="Phương thức thanh toán">
        <span ref={frame} className="u015-frame" aria-hidden="true" />
        {options.map((o, i) => (
          <button key={o.id} ref={(el) => { refs.current[o.id] = el; }} className="u015-opt" type="button" role="radio"
            aria-checked={value === o.id} tabIndex={value === o.id ? 0 : -1} onClick={() => onChange(o.id)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
              if (d) { e.preventDefault(); const n = options[(i + d + options.length) % options.length]; onChange(n.id); refs.current[n.id]?.focus(); }
            }}>
            <span className="u015-dot" aria-hidden="true" />
            <span className="u015-ic" style={{ ["--g" as string]: o.color }} aria-hidden="true">{ICONS[o.icon]}</span>
            <span className="u015-txt"><b>{o.title}{o.badge && <em>{o.badge}</em>}</b><small>{o.note}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}
