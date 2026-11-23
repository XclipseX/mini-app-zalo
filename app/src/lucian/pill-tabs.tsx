// Lucian UX/UI Prompt #039 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#039
// Thanh tab dạng viên thuốc: viên nền co giãn trượt tới tab được chọn; phím ← → để chuyển.
import React, { useLayoutEffect, useRef } from "react";

export interface TabItem { id: string; label: string }

export default function LucianPillTabs({ items, value, onChange, label }: { items: TabItem[]; value: string; onChange: (id: string, dir: number) => void; label: string }) {
  const pill = useRef<HTMLSpanElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const first = useRef(true);

  useLayoutEffect(() => {
    const t = refs.current[value], p = pill.current;
    if (!t || !p) return;
    if (first.current) p.style.transition = "none";
    p.style.setProperty("--x", t.offsetLeft + "px");
    p.style.setProperty("--w", t.offsetWidth + "px");
    if (first.current) { void p.offsetWidth; p.style.transition = ""; first.current = false; }
    t.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [value, items.length]);

  const idx = items.findIndex((i) => i.id === value);
  return (
    <div className="ux u039">
      <div className="u039-tabs" role="tablist" aria-label={label}>
        <span ref={pill} className="u039-pill" aria-hidden="true" />
        {items.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} className="u039-tab" type="button" role="tab"
            aria-selected={t.id === value} tabIndex={t.id === value ? 0 : -1}
            onClick={() => t.id !== value && onChange(t.id, i > idx ? 1 : -1)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (d) { e.preventDefault(); const n = items[(i + d + items.length) % items.length]; onChange(n.id, d); refs.current[n.id]?.focus(); }
            }}>{t.label}</button>
        ))}
      </div>
    </div>
  );
}

/** Hiệu ứng danh sách trượt vào theo hướng chuyển tab (thời lượng/đường cong của #039). */
export function slideIn(container: HTMLElement | null, dir: number) {
  if (!container || !Element.prototype.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  Array.from(container.children).forEach((el, k) => {
    (el as HTMLElement).animate(
      [{ transform: `translateX(${dir * 70}%)`, opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 550, delay: k * 45, easing: "cubic-bezier(.34,1.45,.64,1)", fill: "backwards" });
  });
}
