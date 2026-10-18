"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Search } from "lucide-react";
import { createFaculty, createStudent, listFaculty, listStudents } from "@/api/admin.api.js";
import { CheckIcon } from "@/components/analytics-dashboard/icons";

type Account = {
  _id: string;
  name: string;
  email: string;
  role: string;
  rollNumber?: string;
};

type Feedback = { tone: "good" | "bad"; message: string } | null;
type FieldErrors = { name?: string; email?: string; password?: string; rollNumber?: string };

type FormState = { name: string; email: string; password: string; rollNumber: string };

const EMPTY_FORM: FormState = { name: "", email: "", password: "", rollNumber: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type AccountManagerProps = {
  /** Singular role label, e.g. "Faculty". */
  role: string;
  title: string;
  subtitle: string;
  createLabel: string;
  withRollNumber?: boolean;
  create: (input: { name: string; email: string; password: string; rollNumber?: string }) => Promise<{ message?: string; user: Account }>;
  list: () => Promise<{ users: Account[] }>;
};

/**
 * Shared create-and-list screen for the Admin dashboard. Faculty and Student
 * pages are the same component with a different role, endpoint and field set.
 */
function AccountManager({ role, title, subtitle, createLabel, withRollNumber = false, create, list }: AccountManagerProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [submitting, setSubmitting] = useState(false);
  const loading = accounts === null;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { users } = await list();
        if (active) setAccounts(users);
      } catch (error) {
        if (active) {
          setAccounts([]);
          setListError(error?.message || `Could not load ${role.toLowerCase()} accounts.`);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [list, role]);

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((errors) => ({ ...errors, [key]: undefined }));
    if (feedback) setFeedback(null);
  }

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (withRollNumber && !form.rollNumber.trim()) errors.rollNumber = "Roll number is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const input = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(withRollNumber ? { rollNumber: form.rollNumber.trim() } : {}),
      };
      const result = await create(input);
      if (result?.user) setAccounts((current) => [result.user, ...(current ?? [])]);
      setForm(EMPTY_FORM);
      setFeedback({ tone: "good", message: result?.message || `${role} account created` });
    } catch (error) {
      setFeedback({ tone: "bad", message: error?.message || `Could not create the ${role.toLowerCase()} account.` });
    } finally {
      setSubmitting(false);
    }
  }

  const count = accounts?.length ?? 0;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return accounts ?? [];
    return (accounts ?? []).filter((account) =>
      [account.name, account.email, account.rollNumber].some((field) =>
        String(field ?? "").toLowerCase().includes(needle)
      )
    );
  }, [accounts, query]);

  return (
    <div className="page-content">
      <header className="page-head enter" style={{ "--i": 1 } as CSSProperties}>
        <div className="page-head-text">
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        <span className="tag">
          {count} {count === 1 ? "account" : "accounts"}
        </span>
      </header>

      <section className="card enter" style={{ "--i": 2 } as CSSProperties} aria-labelledby={`${id}-create`}>
        <h2 id={`${id}-create`} className="card-title">
          {createLabel}
        </h2>
        <form className="account-form" onSubmit={handleSubmit} noValidate>
          <div className="fields">
            <label className="field">
              <span className="field-label">Full name</span>
              <input
                name="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.name)}
                placeholder="e.g. Aarav Sharma"
                disabled={submitting}
              />
              {fieldErrors.name && (
                <span className="field-hint" data-error="true">
                  {fieldErrors.name}
                </span>
              )}
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.email)}
                placeholder="name@college.edu"
                disabled={submitting}
              />
              {fieldErrors.email && (
                <span className="field-hint" data-error="true">
                  {fieldErrors.email}
                </span>
              )}
            </label>
            <label className="field">
              <span className="field-label">Temporary password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                disabled={submitting}
              />
              {fieldErrors.password && (
                <span className="field-hint" data-error="true">
                  {fieldErrors.password}
                </span>
              )}
            </label>
            {withRollNumber && (
              <label className="field">
                <span className="field-label">Roll number</span>
                <input
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={(e) => update("rollNumber", e.target.value)}
                  autoComplete="off"
                  aria-invalid={Boolean(fieldErrors.rollNumber)}
                  placeholder="e.g. 22BCE1234"
                  disabled={submitting}
                />
                {fieldErrors.rollNumber && (
                  <span className="field-hint" data-error="true">
                    {fieldErrors.rollNumber}
                  </span>
                )}
              </label>
            )}
          </div>

          {feedback && (
            <p className="ad-note" data-tone={feedback.tone} role="status">
              {feedback.tone === "good" && (
                <span className="ad-note-icon" aria-hidden="true">
                  <CheckIcon size={15} strokeWidth={2.4} />
                </span>
              )}
              {feedback.message}
            </p>
          )}

          <div className="account-form-foot">
            <p className="account-foot-hint">
              Passwords are hashed on the server before storage and never returned by the API.
            </p>
            <button type="submit" className="btn btn-primary press" disabled={submitting}>
              {submitting ? "Creating…" : createLabel}
            </button>
          </div>
        </form>
      </section>

      <section className="block enter" style={{ "--i": 3 } as CSSProperties} aria-labelledby={`${id}-list`}>
        <div className="block-head">
          <h2 id={`${id}-list`} className="block-title">
            {title} accounts
          </h2>
        </div>

        {loading && <p className="field-hint">Loading {title.toLowerCase()} accounts…</p>}

        {listError && (
          <p className="ad-note" data-tone="bad" role="alert">
            {listError}
          </p>
        )}

        {!loading && !listError && count === 0 && (
          <div className="empty account-empty">
            <p className="empty-title">No {title.toLowerCase()} accounts yet</p>
            <p className="empty-sub">Create the first one with the form above.</p>
          </div>
        )}

        {!loading && !listError && count > 0 && (
          <>
            <div className="account-toolbar">
              <label className="account-search">
                <Search size={15} strokeWidth={1.9} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${title.toLowerCase()} by name, email or roll number`}
                  aria-label={`Search ${title.toLowerCase()} accounts`}
                />
              </label>
              <span className="field-hint">
                Showing {filtered.length} of {count}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="empty account-empty">
                <p className="empty-title">No matches</p>
                <p className="empty-sub">No {title.toLowerCase()} account matches “{query.trim()}”.</p>
              </div>
            ) : (
              <div className="account-table-wrap">
                <table className="account-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      {withRollNumber && <th scope="col">Roll number</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((account) => (
                      <tr key={account._id}>
                        <td className="cell-name">{account.name}</td>
                        <td className="cell-mono">{account.email}</td>
                        <td>
                          <span className="role-tag" data-role={account.role}>
                            {account.role}
                          </span>
                        </td>
                        {withRollNumber && <td className="cell-mono">{account.rollNumber || "—"}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export function FacultyAccountsPage() {
  return (
    <AccountManager
      role="Faculty"
      title="Faculty"
      subtitle="Create faculty accounts and review the people who can sign in."
      createLabel="Create faculty account"
      create={createFaculty}
      list={listFaculty}
    />
  );
}

export function StudentAccountsPage() {
  return (
    <AccountManager
      role="Student"
      title="Students"
      subtitle="Create student accounts and review roll numbers and sign-in details."
      createLabel="Create student account"
      withRollNumber
      create={createStudent}
      list={listStudents}
    />
  );
}
