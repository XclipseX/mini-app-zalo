import React from "react";

export default function StampCard({ stamps, lift = false }: { stamps: number; lift?: boolean }) {
  return (
    <div className={"card" + (lift ? " lift" : "")}>
      <div className="row"><h3 style={{ fontSize: 17 }}>Thu thập tem</h3><span className="warn">Hết hạn sau 30 ngày</span></div>
      <div className="muted">Còn {10 - stamps} ly nữa để nhận 1 ly miễn phí!</div>
      <div className="stamps">
        {Array.from({ length: 10 }, (_, i) =>
          i < stamps ? <div key={i} className="stamp on" /> : i === 9 ? <div key={i} className="stamp gift">🎁</div> : <div key={i} className="stamp">{i + 1}</div>
        )}
      </div>
      <div className="bar"><i style={{ width: `${stamps * 10}%` }} /></div>
    </div>
  );
}
