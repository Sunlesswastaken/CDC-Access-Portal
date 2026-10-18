import type { CSSProperties } from "react";

export type RoleSlice = { role: string; count: number };

/** Fixed colours per role so the donut and its legend always agree. */
const ROLE_COLOR: Record<string, string> = {
  admin: "#1d3a6b",
  faculty: "#4f46e5",
  student: "#0d9488",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Admins",
  faculty: "Faculty",
  student: "Students",
};

/**
 * Hand-rolled SVG donut of the role distribution. The circle's radius is chosen
 * so the circumference is 100, which lets us pass plain percentages straight to
 * stroke-dasharray without any trigonometry.
 */
export function RoleDonut({ slices }: { slices: RoleSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  // Running total of percentages so each slice starts where the last one ended.
  const cumulative = slices.reduce<number[]>((offsets, slice) => {
    const percent = total > 0 ? (slice.count / total) * 100 : 0;
    offsets.push((offsets[offsets.length - 1] ?? 0) + percent);
    return offsets;
  }, []);

  const segments = slices.map((slice, index) => {
    const percent = total > 0 ? (slice.count / total) * 100 : 0;
    const before = index === 0 ? 0 : cumulative[index - 1];
    return {
      ...slice,
      // A stroked circle starts at 3 o'clock; 25 shifts the first slice to 12 o'clock.
      dasharray: `${percent} ${100 - percent}`,
      dashoffset: 25 - before,
    };
  });

  return (
    <div className="donut-body">
      <div className="donut-wrap">
        <div className="donut">
          <svg viewBox="0 0 42 42" role="img" aria-label={`Accounts by role, ${total} total`}>
            <circle className="donut-track" cx="21" cy="21" r="15.9155" />
            {segments.map((segment) => (
              <circle
                key={segment.role}
                className="donut-seg"
                cx="21"
                cy="21"
                r="15.9155"
                stroke={ROLE_COLOR[segment.role] ?? "#64748b"}
                strokeDasharray={segment.dasharray}
                strokeDashoffset={segment.dashoffset}
              />
            ))}
          </svg>
          <div className="donut-center">
            <span className="donut-value">{total}</span>
            <span className="donut-label">{total === 1 ? "account" : "accounts"}</span>
          </div>
        </div>
      </div>

      <ul className="donut-legend">
        {slices.map((slice) => (
          <li key={slice.role}>
            <i style={{ "--c": ROLE_COLOR[slice.role] ?? "#64748b" } as CSSProperties} aria-hidden="true" />
            {ROLE_LABEL[slice.role] ?? slice.role}
            <span className="legend-count">{slice.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
