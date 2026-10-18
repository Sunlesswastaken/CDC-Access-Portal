import { useEffect, useState, type CSSProperties } from "react";
import { GraduationCap, ShieldCheck, UserCog, Users } from "lucide-react";
import { getStats } from "@/api/admin.api.js";
import { useDashboard } from "@/components/analytics-dashboard/context";
import { StatCard } from "@/components/portal/StatCard";
import { RoleDonut, type RoleSlice } from "@/components/portal/RoleDonut";
import { CreatedBarChart, type DayCount } from "@/components/portal/CreatedBarChart";

type Stats = {
  totals: { users: number; students: number; faculty: number; roles: number };
  byRole: RoleSlice[];
  createdByDate: DayCount[];
  windowDays: number;
};

const PREVIEW_CARDS = [
  { label: "Total users", Icon: Users },
  { label: "Students", Icon: GraduationCap },
  { label: "Faculty", Icon: UserCog },
  { label: "Roles", Icon: ShieldCheck },
];

/**
 * Admin landing page. Every figure comes from GET /api/admin/stats, which
 * aggregates the real User collection — nothing here is mocked.
 */
export function PortalOverviewPage() {
  const { preview } = useDashboard();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preview) return;
    let active = true;
    getStats()
      .then((data: Stats) => {
        if (active) setStats(data);
      })
      .catch((err: { message?: string }) => {
        if (active) setError(err?.message || "Could not load dashboard statistics.");
      });
    return () => {
      active = false;
    };
  }, [preview]);

  // Preview mode (login screen): show the layout with skeletons, never fake numbers.
  if (preview) {
    return (
      <div className="page-content">
        <header className="page-head enter" style={{ "--i": 1 } as CSSProperties}>
          <div className="page-head-text">
            <h1 className="page-title">Overview</h1>
            <p className="page-sub">Accounts and access at a glance</p>
          </div>
        </header>
        <ul className="stats" aria-hidden="true">
          {PREVIEW_CARDS.map(({ label, Icon }, index) => (
            <li className="stat enter" key={label} style={{ "--i": 2 + index * 0.4 } as CSSProperties}>
              <span className="stat-label">
                <Icon size={16} strokeWidth={1.8} className="stat-icon" aria-hidden="true" />
                {label}
              </span>
              <div className="stat-row">
                <span className="portal-skeleton portal-skeleton-line" />
              </div>
            </li>
          ))}
        </ul>
        <div className="overview-grid" aria-hidden="true">
          <section className="card enter" style={{ "--i": 3.4 } as CSSProperties}>
            <header className="card-head">
              <h2 className="card-title">Accounts created</h2>
            </header>
            <div className="portal-skeleton portal-skeleton-chart" />
          </section>
          <section className="card enter" style={{ "--i": 3.8 } as CSSProperties}>
            <header className="card-head">
              <h2 className="card-title">Role distribution</h2>
            </header>
            <div className="portal-skeleton portal-skeleton-donut" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <header className="page-head enter" style={{ "--i": 1 } as CSSProperties}>
        <div className="page-head-text">
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">Accounts and access at a glance</p>
        </div>
      </header>

      {error && (
        <p className="ad-note" data-tone="bad" role="alert">
          {error}
        </p>
      )}

      {!stats && !error && (
        <section className="card enter" style={{ "--i": 2 } as CSSProperties}>
          <p className="field-hint">Loading dashboard statistics…</p>
        </section>
      )}

      {stats && (
        <>
          <ul className="stats" aria-label="Key metrics">
            <StatCard label="Total users" value={stats.totals.users} hint="All roles combined" Icon={Users} index={0} />
            <StatCard label="Students" value={stats.totals.students} hint="Accounts with a QR code" Icon={GraduationCap} index={1} />
            <StatCard label="Faculty" value={stats.totals.faculty} hint="Teaching accounts" Icon={UserCog} index={2} />
            <StatCard label="Roles" value={stats.totals.roles} hint="Admin · Faculty · Student" Icon={ShieldCheck} index={3} />
          </ul>

          <div className="overview-grid">
            <section className="card enter" style={{ "--i": 3.4 } as CSSProperties} aria-labelledby="portal-created">
              <header className="card-head">
                <h2 id="portal-created" className="card-title">
                  Accounts created
                </h2>
                <span className="tag">Last {stats.windowDays} days</span>
              </header>
              <CreatedBarChart days={stats.createdByDate} />
            </section>

            <section className="card enter" style={{ "--i": 3.8 } as CSSProperties} aria-labelledby="portal-roles">
              <header className="card-head">
                <h2 id="portal-roles" className="card-title">
                  Role distribution
                </h2>
              </header>
              <RoleDonut slices={stats.byRole} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
