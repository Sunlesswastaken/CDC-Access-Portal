# CDC Access Portal — Mini MERN Authentication & Role-Based Dashboard

A small MERN application built for the **CDC Developer Selection Assignment**. It demonstrates authentication, role-based access control, account management, and a clean React UI with three roles: **Admin**, **Faculty**, and **Student**.

- **Admin** logs in, creates Faculty and Student accounts, and views their lists.
- **Faculty** logs in and views only their own profile.
- **Student** logs in and views only their own profile plus a **unique QR code**.

Attendance scanning, attendance recording, and course management are intentionally out of scope.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), Tailwind CSS v4, React Router, `qrcode.react` |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (Bearer token), bcrypt password hashing |
| Tooling | Git/GitHub, oxlint, TypeScript type-checking for the UI blocks |

## Project Structure

```
server/
  src/
    config/db.js
    models/User.js
    controllers/   auth.controller.js  admin.controller.js  profile.controller.js
    routes/        auth.routes.js  admin.routes.js  profile.routes.js
    middleware/    auth.middleware.js  error.middleware.js
    scripts/seedAdmin.js
    app.js  server.js
  .env.example
client/
  src/
    api/           apiClient.js  auth.api.js  admin.api.js  profile.api.js
    components/    ProtectedRoute.jsx  RoleRoute.jsx  FormInput.jsx  LoadingState.jsx  Message.jsx
    pages/         LoginPage.jsx  AdminDashboard.jsx  FacultyDashboard.jsx  StudentDashboard.jsx
    context/AuthContext.jsx
    App.jsx  main.jsx
  .env.example
README.md
```

## Setup and Run

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. MongoDB

Start a local MongoDB instance on the default port:

```bash
mongod
```

No database or collection needs to be created by hand — Mongoose creates the `users` collection on first use. To use MongoDB Atlas instead, put your connection string in `server/.env` (see below).

### 2. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit the values
npm run seed:admin        # creates the initial Admin account
npm run dev               # API on http://localhost:5000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev               # UI on http://localhost:5173
```

Open `http://localhost:5173` and sign in with the seeded Admin credentials. In development the Vite dev server proxies `/api` to `http://localhost:5000`, so no frontend configuration is needed.

## Environment Variables

`server/.env` (never committed — only `.env.example` is tracked):

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | API port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/mini_mern_auth` |
| `JWT_SECRET` | Secret used to sign JWTs (long random string) | `replace-with-a-long-random-string` |
| `ADMIN_EMAIL` | Email of the Admin created by the seed script | `admin@example.com` |
| `ADMIN_PASSWORD` | Initial password for that Admin (min 8 chars) | `ChangeMe123!` |

`client/.env` (optional):

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Override the API base URL. Leave empty to use the Vite dev proxy. | `` (empty) |

## Admin Seed (no public registration)

There is **no public Admin registration endpoint**. The initial Admin is created by a script:

```bash
cd server
# set ADMIN_EMAIL and ADMIN_PASSWORD in .env first
npm run seed:admin
```

The script creates the Admin only if one with that email does not already exist and refuses to overwrite an existing non-admin account.

### Demo credentials

Set your own values in `server/.env` before seeding and share them with reviewers safely (for example in the submission message, not in code). Using the `.env.example` placeholders, the local demo login is:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `ChangeMe123!` |

Accounts created through the Admin dashboard are stored in your own MongoDB and are not part of this repository. **Do not commit `.env` or real passwords.**

## API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate a user, returns a JWT |
| `POST` | `/api/auth/logout` | Authenticated | Clear the client session |
| `GET` | `/api/auth/me` | Authenticated | Return the logged-in user's basic details |
| `POST` | `/api/admin/faculty` | Admin only | Create a Faculty account |
| `GET` | `/api/admin/faculty` | Admin only | List Faculty accounts |
| `POST` | `/api/admin/students` | Admin only | Create a Student account |
| `GET` | `/api/admin/students` | Admin only | List Student accounts |
| `GET` | `/api/admin/stats` | Admin only | Account counts for the Admin overview |
| `GET` | `/api/profile/me` | Authenticated | Return the current user's own profile |
| `GET` | `/api/health` | Public | Health check |

Requests except login carry `Authorization: Bearer <token>`. The backend derives the current user **only** from the verified token — never from a client-supplied id or role.

## How the Security Works

- **Passwords** are hashed with bcrypt (cost 10) before storage; `passwordHash` is stripped from every API response by the Mongoose schema's `toJSON` transform.
- **JWTs** carry only the user id; the role is re-read from the database on every request, so role changes or deleted accounts take effect immediately.
- **Authorization** is enforced in Express middleware (`requireAuth` + `requireRole('admin')` on all `/api/admin/*` routes), not by hiding buttons in React. Faculty/Student tokens receive `403`.
- **Self-profile only:** `/api/profile/me` and `/api/auth/me` ignore any id in the URL or body and return the caller's own record.
- **Uniqueness** is enforced by indexes: `email` (all users), `rollNumber` and `studentQrId` (students, via partial indexes). Duplicate keys are returned as a friendly `409`.
- **Validation** (name, email format, required fields, password length, roll number for students) happens on both the client and the server.
- **Student QR code** encodes only the non-sensitive `studentQrId` (`STU-<uuid>`) — never a password, JWT, or session id.
- **Secrets** live in environment variables; `.env` is git-ignored and only `.env.example` is committed.
- **Expired tokens:** when the server rejects a token mid-session, the client clears it and the route guards redirect to the login page.

## Testing Steps

Run both servers, then walk through this checklist:

1. Log in with the seeded Admin credentials.
2. Try a wrong password — expect "Invalid email or password".
3. Admin → Faculty: create a Faculty account (name, email, temporary password).
4. Admin → Students: create a Student account (name, email, password, roll number).
5. Try creating a duplicate email and a duplicate roll number — both are rejected with a clear message.
6. Log out, then log in as the new Faculty — only that Faculty member's profile is visible.
7. Log out, then log in as the new Student — profile plus a unique QR code are visible.
8. As Faculty or Student, call an Admin API directly (for example `GET /api/admin/students` with the user's token) — expect `403`.
9. Confirm no API response contains a `passwordHash`.
10. Confirm logout clears the session and protected pages redirect to `/login`.

UI checks: loading states while signing in, empty states ("No faculty accounts yet"), validation messages on the create forms, and responsive layout on a phone-sized viewport.

## Screenshots / Demo

Capture these screens for submission (run the app locally first):

- [ ] Login page (including an invalid-credentials error)
- [ ] Admin dashboard — Faculty create form and list
- [ ] Admin dashboard — Student create form and list (with roll numbers)
- [ ] Faculty dashboard — own profile only
- [ ] Student dashboard — own profile with QR code
- [ ] Student QR scanned with a phone camera (it decodes to the `STU-<uuid>` identifier)

A 3–5 minute demo script: sign in as Admin → create a Faculty account → create a Student account → log out → sign in as Faculty → show profile → log out → sign in as Student → show profile and QR code.

## AI Tools Used

This project was built with **opencode (AI coding agent)**. It was used to scaffold the client/server structure, implement the Express routes and middleware, build the React pages and reusable components, and draft this README. All generated code was reviewed and exercised locally: the API flow (login, account creation, duplicate handling, role enforcement, self-profile) and the frontend production build were verified rather than assumed.

## Known Limitations

- No password reset / change-password flow (out of scope for this assignment).
- QR codes identify a student only — QR scanning and attendance recording are intentionally out of scope.
- JWTs last 1 day; there is no refresh-token rotation.
- Logout is client-side token discard (stateless JWT); a token blacklist is not implemented.
- The app runs locally by default and is not deployed.
- Screenshots/demo recording are prepared as a checklist above and must be captured on a running instance before submission.
