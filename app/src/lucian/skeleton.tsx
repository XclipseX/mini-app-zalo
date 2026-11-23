// Lucian UX/UI Prompt #439 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#439
// Khung chờ: các "xương" đúng vị trí nội dung thật, ánh sáng quét qua trong lúc tải.
import React from "react";

/** rows: danh sách [chiều rộng, chiều cao] của từng xương, ví dụ [["40%",14],["90%",12]] */
export default function LucianSkeleton({ rows, label = "Đang tải" }: { rows: [string, number][]; label?: string }) {
  return (
    <div className="ux u439 lx-sk is-loading" role="status" aria-label={label}>
      <div className="u439-c" aria-busy="true">
        <div className="u439-sk" aria-hidden="true" style={{ gridArea: "auto" }}>
          {rows.map(([w, h], i) => <i key={i} className="bone" style={{ width: w, height: h, ["--d" as string]: `${i * 0.06}s` }} />)}
        </div>
      </div>
    </div>
  );
}
