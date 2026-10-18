import type { CSSProperties } from "react";

export type DayCount = { date: string; count: number };

/** "2026-10-15" -> "15"; keeps the axis short. */
function dayOfMonth(isoDate: string) {
  return isoDate.slice(8, 10);
}

/**
 * Hand-rolled bar chart of accounts created per day. Reuses the dashboard's
 * existing chart scaffolding (`.chart`, `.chart-cols`, `.chart-col`) and only
 * swaps the stacked bar for a single gradient bar.
 */
export function CreatedBarChart({ days }: { days: DayCount[] }) {
  const max = Math.max(1, ...days.map((day) => day.count));
  const cols = Math.max(days.length, 1);
  const summary = days.map((day) => `${day.date}: ${day.count}`).join(", ");

  return (
    <figure className="chart" role="img" aria-label={`Accounts created per day. ${summary || "No data yet"}`}>
      <div className="chart-grid" aria-hidden="true">
        {[1, 0.66, 0.33, 0].map((fraction) => (
          <span key={fraction} data-value={Math.round(max * fraction)} />
        ))}
      </div>
      <div className="chart-cols" style={{ "--cols": cols } as CSSProperties}>
        {days.map((day, index) => (
          <div key={day.date} className="chart-col" style={{ "--col": index } as CSSProperties}>
            <div className="bar-wrap">
              <div
                className="portal-bar"
                style={{ height: `${(day.count / max) * 100}%` } as CSSProperties}
                title={`${day.count} on ${day.date}`}
              />
            </div>
            <span className="chart-label">{dayOfMonth(day.date)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
