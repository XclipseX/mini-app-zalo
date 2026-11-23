// Lucian UX/UI Prompt #442 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#442
// Ảnh món bay theo đường cong vào giỏ (720ms), giỏ lắc, số trên giỏ nảy lên.
export function flyToCart(from: HTMLElement | null, cart: HTMLElement | null, artHtml: string, onHit: () => void) {
  const hit = () => {
    onHit();
    if (cart) { cart.classList.remove("is-hit"); void cart.offsetWidth; cart.classList.add("is-hit"); }
  };
  if (!from || !cart || !Element.prototype.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { hit(); return; }
  const a = from.getBoundingClientRect(), b = cart.getBoundingClientRect();
  const fly = document.createElement("span");
  fly.className = "ux u442-fly"; fly.setAttribute("aria-hidden", "true"); fly.innerHTML = artHtml;
  document.body.appendChild(fly);
  const sx = a.left + a.width / 2 - 28, sy = a.top + a.height / 2 - 28, ex = b.left + b.width / 2 - 28, ey = b.top + b.height / 2 - 28;
  const cx = (sx + ex) / 2 - 20, cy = Math.min(sy, ey) - 90, frames: Keyframe[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12, u = 1 - t;
    const x = u * u * sx + 2 * u * t * cx + t * t * ex, y = u * u * sy + 2 * u * t * cy + t * t * ey;
    frames.push({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(1 - t * 0.66).toFixed(3)}) rotate(${(t * 24).toFixed(1)}deg)`, opacity: t > 0.92 ? 0 : 1, offset: t });
  }
  const an = fly.animate(frames, { duration: 720, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
  an.onfinish = () => { fly.remove(); hit(); };
}
