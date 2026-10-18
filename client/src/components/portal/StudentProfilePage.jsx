import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '@/context/AuthContext.jsx'
import { Avatar } from '@/components/analytics-dashboard/ui'

/**
 * The logged-in student's own profile plus their unique QR code.
 * Details come from the authenticated user (GET /api/auth/me) — never from a
 * URL or request body — so a student can only ever see their own account here.
 *
 * The QR code encodes only the non-sensitive `studentQrId` (for example
 * "STU-<uuid>"). No passwords, tokens or session ids are ever placed in it.
 */
export function StudentProfilePage() {
  const { user } = useAuth()
  const studentQrId = user?.studentQrId || ''

  // Content is centered in the main area: a fixed-width column, centered
  // horizontally (mx-auto) and vertically (justify-center on page-content)
  // whenever the viewport has room to spare.
  return (
    <div className="page-content settings justify-center">
      <header className="page-head enter mx-auto w-full max-w-[760px]" style={{ '--i': 1 }}>
        <div className="page-head-text">
          <h1 className="page-title">My profile</h1>
          <p className="page-sub">Your student account details and QR code</p>
        </div>
        <span className="tag">{user?.role}</span>
      </header>

      <div className="settings-form mx-auto w-full max-w-[760px]">
        <section
          className="card settings-card enter"
          style={{ '--i': 2 }}
          aria-labelledby="portal-student-profile"
        >
          <h2 id="portal-student-profile" className="card-title">
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
              <input value={user?.name ?? ''} readOnly />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input value={user?.email ?? ''} readOnly />
            </label>
            <label className="field">
              <span className="field-label">Roll number</span>
              <input value={user?.rollNumber ?? ''} readOnly />
            </label>
            <label className="field">
              <span className="field-label">Role</span>
              <input value={user?.role ?? ''} readOnly />
            </label>
          </div>
        </section>

        <section
          className="card settings-card enter"
          style={{ '--i': 3 }}
          aria-labelledby="portal-student-qr"
        >
          <h2 id="portal-student-qr" className="card-title">
            Student QR code
          </h2>
          <div className="flex flex-col items-center gap-3 py-3">
            {studentQrId ? (
              <>
                <div className="rounded-xl bg-white p-3 ring-1 ring-black/10">
                  <QRCodeSVG
                    value={studentQrId}
                    size={168}
                    level="M"
                    marginSize={0}
                    bgColor="#ffffff"
                    fgColor="#10264a"
                  />
                </div>
                <p
                  className="max-w-[260px] break-all text-center text-[11.5px] leading-relaxed"
                  style={{ color: 'var(--text-2)' }}
                >
                  {studentQrId}
                </p>
                <p
                  className="max-w-[280px] text-center text-[12px] leading-relaxed"
                  style={{ color: 'var(--text-3)' }}
                >
                  Scan to identify this student. Contains no secret information.
                </p>
              </>
            ) : (
              <p className="py-3 text-[12.5px]" style={{ color: 'var(--text-3)' }}>
                No QR code is available for this account.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
