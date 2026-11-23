// Lucian UX/UI Prompt #435 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#435
// Thông báo nổi: bật lên từ dưới, tick tự vẽ, thanh thời gian chạy; xếp chồng tối đa 3; chạm thì xoè ra và dừng giờ;
// vuốt ngang hoặc × để tắt. API giống useSnackbar của zmp-ui: openSnackbar({ text, type }).
import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "warning" | "info" | string;
type Show = (o: { text: string; type?: ToastType }) => void;
const Ctx = createContext<{ openSnackbar: Show }>({ openSnackbar: () => {} });
export const useToast = () => useContext(Ctx);

const OK = '<svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9"/></svg>';
const WARN = '<svg viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>';

function createHost(rg: HTMLElement) {
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const H = 56, GAP = 8, LIFE = 4500, MAX = 3;
  type T = { el: HTMLElement; gone?: boolean; tm?: number; t0?: number; left: number; dx?: number; v?: number };
  const toasts: T[] = [];
  let open = false, paused = false, leaveT = 0;
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };

  function layout() {
    const live = toasts.filter((t) => !t.gone), n = live.length;
    live.forEach((t, k) => {
      const i = n - 1 - k, y = open ? -i * (H + GAP) : -i * 11, s = open ? 1 : 1 - i * 0.055;
      t.el.style.setProperty("--y", y + "px"); t.el.style.setProperty("--s", s.toFixed(3)); t.el.style.setProperty("--o", i < MAX ? "1" : "0");
      t.el.style.zIndex = String(20 - i); t.el.classList.toggle("is-back", !open && i > 0);
    });
    rg.style.height = (open && n > 1 ? n * H + (n - 1) * GAP : H + 20) + "px";
  }
  function timer(t: T) { if (t.tm) clearTimeout(t.tm); t.t0 = Date.now(); if (!paused) t.tm = later(() => dismiss(t), t.left); }
  function bar(t: T, ms: number) { t.el.querySelector(".u435-pb")!.innerHTML = `<i style="animation-duration:${ms}ms"></i>`; t.left = ms; timer(t); }
  function dismiss(t: T, dir = 0, quiet = false) {
    if (t.gone) return; t.gone = true; if (t.tm) clearTimeout(t.tm);
    const el = t.el; el.style.pointerEvents = "none";
    const done = () => { el.remove(); const i = toasts.indexOf(t); if (i >= 0) toasts.splice(i, 1); };
    layout();
    if (rm || !el.animate) { done(); return; }
    const y = el.style.getPropertyValue("--y") || "0px", s = Number(el.style.getPropertyValue("--s") || 1);
    if (dir) {
      const v = Math.max(1.2, Math.abs(t.v || 0)), dist = 380, dur = Math.max(160, Math.min(320, dist / v));
      el.classList.add("is-drag");
      el.animate([{ transform: `translate3d(${t.dx || 0}px,${y},0) scale(${s})`, opacity: 1 }, { transform: `translate3d(${dir * dist}px,${y},0) scale(${s}) rotate(${dir * 6}deg)`, opacity: 0 }], { duration: dur, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }).onfinish = done;
    } else {
      el.animate([{ opacity: quiet ? 0 : 1 }, { transform: `translate3d(0,calc(${y} + 14px),0) scale(${s * 0.94})`, opacity: 0 }], { duration: 260, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" }).onfinish = done;
    }
  }
  function swipe(t: T) {
    const el = t.el; let on = false, x0 = 0; let last: [number, number][] = [];
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest("button") || t.gone) return;
      on = true; x0 = e.clientX; t.dx = 0; t.v = 0; last = [[e.clientX, e.timeStamp]]; el.classList.add("is-drag");
      try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    });
    el.addEventListener("pointermove", (e) => {
      if (!on) return; t.dx = e.clientX - x0; last.push([e.clientX, e.timeStamp]); if (last.length > 5) last.shift();
      el.style.setProperty("--x", t.dx.toFixed(1) + "px"); el.style.opacity = String(Math.max(0.35, 1 - Math.abs(t.dx) / 320));
    });
    const end = () => {
      if (!on) return; on = false;
      const a = last[0], b = last[last.length - 1]; t.v = b && a && b[1] > a[1] ? (b[0] - a[0]) / (b[1] - a[1]) : 0; el.style.opacity = "";
      if (Math.abs(t.dx || 0) > 80 || Math.abs(t.v) > 0.6) { dismiss(t, (Math.abs(t.v) > 0.6 ? t.v : t.dx || 0) > 0 ? 1 : -1); return; }
      el.classList.remove("is-drag"); el.style.setProperty("--x", "0px"); t.dx = 0;
    };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  }
  function setOpen(v: boolean) {
    if (open === v) return; open = v; paused = v; rg.classList.toggle("is-paused", v);
    toasts.forEach((t) => { if (t.gone) return; if (v) { if (t.tm) clearTimeout(t.tm); t.left = Math.max(500, t.left - (Date.now() - (t.t0 || 0))); } else timer(t); });
    layout();
  }
  const onEnter = () => { clearTimeout(leaveT); setOpen(true); };
  const onLeave = () => { clearTimeout(leaveT); leaveT = later(() => { if (!rg.contains(document.activeElement)) setOpen(false); }, 120); };
  rg.addEventListener("pointerenter", onEnter); rg.addEventListener("pointerleave", onLeave);

  function show(text: string, type: ToastType = "success") {
    const el = document.createElement("div");
    el.className = "u435-t" + (type === "success" || type === "info" ? "" : " is-warn");
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = `<span class="u435-ic" aria-hidden="true"><span class="ok">${type === "success" || type === "info" ? OK : WARN}</span><span class="bk"></span></span><span class="u435-tx"><b></b></span><button type="button" class="u435-x" aria-label="Đóng thông báo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><span class="u435-pb" aria-hidden="true"></span>`;
    el.querySelector(".u435-tx b")!.textContent = text;
    const t: T = { el, left: LIFE };
    el.querySelector(".u435-x")!.addEventListener("click", () => dismiss(t));
    swipe(t); toasts.push(t);
    if (!rm) {
      el.classList.add("is-in"); el.style.setProperty("--y", "84px"); el.style.setProperty("--s", ".9"); el.style.setProperty("--o", "0");
      el.style.transition = "none"; rg.appendChild(el); void el.offsetWidth; el.style.transition = "";
    } else rg.appendChild(el);
    bar(t, LIFE);
    const live = toasts.filter((x) => !x.gone); if (live.length > MAX) dismiss(live[0], 0, true);
    layout();
  }
  const destroy = () => { timers.forEach(clearTimeout); toasts.forEach((t) => t.tm && clearTimeout(t.tm)); rg.removeEventListener("pointerenter", onEnter); rg.removeEventListener("pointerleave", onLeave); };
  return { show, destroy };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const rg = useRef<HTMLElement>(null);
  const host = useRef<ReturnType<typeof createHost> | null>(null);
  useEffect(() => { host.current = createHost(rg.current!); return () => host.current?.destroy(); }, []);
  const openSnackbar = useCallback<Show>(({ text, type }) => host.current?.show(text, type), []);
  return (
    <Ctx.Provider value={{ openSnackbar }}>
      {children}
      <div className="ux u435 lx-toast"><section ref={rg} className="u435-rg" aria-label="Thông báo" /></div>
    </Ctx.Provider>
  );
}
