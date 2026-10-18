import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Avatar } from "@/components/analytics-dashboard/ui";

/**
 * The signed-in user's own profile, shown as the "My profile" page and from
 * the account button in the sidebar. Details come from the authenticated user
 * (GET /api/auth/me) — never from a URL or request body — so a user can only
 * ever see their own account here.
 */
export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="page-content settings">
      <header className="page-head enter" style={{ "--i": 1 } as CSSProperties}>
        <div className="page-head-text">
          <h1 className="page-title">My profile</h1>
          <p className="page-sub">Your signed-in account details</p>
        </div>
        <span className="tag">{user?.role}</span>
      </header>

      <div className="settings-form">
        <section className="card settings-card enter" style={{ "--i": 2 } as CSSProperties} aria-labelledby="portal-account">
          <h2 id="portal-account" className="card-title">
            Profile
          </h2>
          <div className="profile-row">
            <Avatar size={40} />
            <div>
              <p className="profile-name">{user?.name}</p>
              <p className="profile-role">{user?.email}</p>
            </div>
          </div>

          <div className="fields">
            <label className="field">
              <span className="field-label">Name</span>
              <input value={user?.name ?? ""} readOnly />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input value={user?.email ?? ""} readOnly />
            </label>
            <label className="field">
              <span className="field-label">Role</span>
              <input value={user?.role ?? ""} readOnly />
            </label>
          </div>

          <div className="save-bar">
            <p className="save-note">Signing out removes your token from this browser.</p>
            <button type="button" className="btn btn-primary press" onClick={handleSignOut}>
              <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
              <span className="btn-label">Sign out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
