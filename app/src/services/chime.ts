// Âm báo đơn mới cho màn hình nhân viên: tự tạo tiếng "ting-tong" bằng Web Audio (không cần file âm thanh).
// Trình duyệt/Zalo chỉ cho phát tiếng sau khi người dùng chạm → phải gọi enableChime() trong sự kiện bấm nút.
let ctx: AudioContext | null = null;

export function enableChime(): boolean {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    ctx = ctx || new AC();
    if (ctx.state === "suspended") void ctx.resume();
    playChime(0.0001); // "mồi" để iOS/Android mở khoá âm thanh
    return true;
  } catch { return false; }
}

export function playChime(volume = 0.35) {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  // 3 nốt đi lên (E6 → G6 → C7), mỗi nốt tắt dần – nghe rõ giữa tiếng ồn quán
  [1318.5, 1568, 2093].forEach((f, i) => {
    const o = ctx!.createOscillator(), g = ctx!.createGain();
    o.type = "sine"; o.frequency.value = f;
    const s = t0 + i * 0.16;
    g.gain.setValueAtTime(0, s);
    g.gain.linearRampToValueAtTime(volume, s + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, s + 0.5);
    o.connect(g).connect(ctx!.destination);
    o.start(s); o.stop(s + 0.55);
  });
  try { navigator.vibrate?.([180, 80, 180]); } catch { /* ignore */ }
}
