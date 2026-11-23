// Lucian UX/UI Prompt #424 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#424
// Accordion: bấm mục nào mở mục đó (một mục một lúc), dấu + gập thành −; phím ↑ ↓ Home End để di chuyển.
import React, { useId, useRef, useState } from "react";

export default function LucianAccordion({ items, defaultOpen = -1 }: { items: { q: string; a: React.ReactNode }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const qs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="ux u424 lx-faq">
      <ul className="u424-ls">
        {items.map((it, i) => (
          <li key={i} className={"u424-it" + (open === i ? " open" : "")}>
            <button ref={(el) => { qs.current[i] = el; }} id={`${uid}-q${i}`} className="u424-q" type="button" aria-expanded={open === i} aria-controls={`${uid}-a${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              onKeyDown={(e) => {
                const n = items.length, to = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
                if (to === null) return; e.preventDefault(); qs.current[(to + n) % n]?.focus();
              }}>
              <span>{it.q}</span><i className="u424-pm" aria-hidden="true" />
            </button>
            <div id={`${uid}-a${i}`} className="u424-a" role="region" aria-labelledby={`${uid}-q${i}`} {...(open === i ? {} : { inert: "" })}>
              <div><p>{it.a}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
