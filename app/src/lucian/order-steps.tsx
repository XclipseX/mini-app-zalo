// Lucian UX/UI Prompt #444 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#444
// Tiến trình đơn: đường nối tô dần, bước xong bật dấu tick, bước hiện tại "thở" nhẹ. Chỉ hiển thị, không bấm.
import React, { useEffect, useState } from "react";

const CHECK = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4 4 9-9.5" /></svg>;

export default function LucianOrderSteps({ steps, current }: { steps: string[]; current: number }) {
  const [cur, setCur] = useState(0);
  const [from, setFrom] = useState(0);
  useEffect(() => { const t = setTimeout(() => { setFrom(cur); setCur(current); }, 250); return () => clearTimeout(t); }, [current]); // eslint-disable-line react-hooks/exhaustive-deps
  const step = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.26;
  const pct = 100 / steps.length;
  return (
    <div className="ux u444">
      <ol className="u444-st" aria-label="Tiến trình đơn hàng">
        {steps.map((s, i) => {
          const done = i < cur, isCur = i === cur, d = done && i >= from ? (i - from) * step + step : 0;
          return (
            <React.Fragment key={s}>
              {i > 0 && (
                <li className={"u444-ln" + (i - 1 < cur ? " is-on" : "")} aria-hidden="true"
                  style={{ left: `calc(${pct * (i - 1) + pct / 2}% + 22px)`, width: `calc(${pct}% - 44px)`, ["--d" as string]: `${Math.max(0, i - 1 - from) * step}s` }}><i /></li>
              )}
              <li className={"u444-s" + (done ? " is-done" : "") + (isCur ? " is-cur" : "")} aria-current={isCur ? "step" : undefined} style={{ ["--d" as string]: `${d}s` }}>
                <span className="u444-dot" role="img" aria-label={s + (done ? ", đã xong" : isCur ? ", hiện tại" : "")} style={{ ["--d" as string]: `${d}s` }}><b>{i + 1}</b>{CHECK}</span>
                <span aria-hidden="true">{s}</span>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
}
