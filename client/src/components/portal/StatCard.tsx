import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  /** Short label, e.g. "Students". */
  label: string;
  /** The real number pulled from the backend. */
  value: number | string;
  /** Optional one-line explanation shown under the value. */
  hint?: string;
  Icon: LucideIcon;
  /** Position in the grid, used for the staggered entrance. */
  index?: number;
};

/** A single statistic tile. Reuses the dashboard's `.stat` card styles. */
export function StatCard({ label, value, hint, Icon, index = 0 }: StatCardProps) {
  return (
    <li className="stat enter" style={{ "--i": 2 + index * 0.4 } as CSSProperties}>
      <span className="stat-label">
        <Icon size={16} strokeWidth={1.8} className="stat-icon" aria-hidden="true" />
        {label}
      </span>
      <div className="stat-row">
        <span className="stat-value">{value}</span>
      </div>
      {hint && <p className="stat-foot">{hint}</p>}
    </li>
  );
}
