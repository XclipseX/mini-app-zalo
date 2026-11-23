// Lucian UX/UI Prompt #018 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#018
// Nút số lượng: số lăn như đồng hồ đo, tổng tiền đếm dần, chạm giới hạn thì lắc đầu.
import React, { useEffect, useRef, useState } from "react";
import { vnd } from "../state/cart";

interface Props { value: number; onChange: (v: number) => void; unitPrice: number; min?: number; max?: number; label?: string }

const DIGITS = Array.from({ length: 10 }, (_, d) => d);

export default function LucianQuantityStepper({ value, onChange, unitPrice, min = 1, max = 20, label = "Tạm tính" }: Props) {
  const step = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value * unitPrice);
  const shownRef = useRef(shown);

  // Tổng tiền đếm dần tới giá trị mới (giữ thời lượng 520ms, ease-out cubic của element)
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = shownRef.current, target = value * unitPrice, t0 = performance.now(), D = rm ? 1 : 520;
    let raf = 0;
    const f = (now: number) => {
      const x = Math.min(1, (now - t0) / D);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - x, 3)));
      shownRef.current = v; setShown(v);
      if (x < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [value, unitPrice]);

  const bump = (d: number) => {
    const n = value + d;
    if (n < min || n > max) {
      const el = step.current!; el.classList.remove("is-shake"); void el.offsetWidth; el.classList.add("is-shake");
      return;
    }
    onChange(n);
  };
  const tens = Math.floor(value / 10), ones = value % 10;

  return (
    <div className="ux u018">
      <div className="u018-row">
        <div ref={step} className="u018-step" role="group" aria-label="Số lượng"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); bump(1); }
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); bump(-1); }
          }}>
          <button className="u018-b mi" type="button" aria-label="Giảm một" aria-disabled={value <= min} onClick={() => bump(-1)}>
            <svg viewBox="0 0 20 20"><path d="M5 10h10" /></svg></button>
          <span className="u018-num" aria-live="polite" aria-atomic="true">
            <span className="u018-sr">{value} phần</span>
            <span className={"u018-col" + (tens === 0 ? " is-hide" : "")} aria-hidden="true" style={{ width: 17, transform: `translateY(${-tens * 34}px)` }}>{DIGITS.map((d) => <span key={d}>{d}</span>)}</span>
            <span className="u018-col" aria-hidden="true" style={{ width: 17, transform: `translateY(${-ones * 34}px)` }}>{DIGITS.map((d) => <span key={d}>{d}</span>)}</span>
          </span>
          <button className="u018-b pl" type="button" aria-label="Thêm một" aria-disabled={value >= max} onClick={() => bump(1)}>
            <svg viewBox="0 0 20 20"><path d="M10 5v10M5 10h10" /></svg></button>
        </div>
        <div className="u018-sum"><small>{label}</small><b>{vnd(shown)}</b></div>
      </div>
    </div>
  );
}
