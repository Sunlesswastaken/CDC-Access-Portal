# AGENTS.md — Mini MERN Authentication & Role-Based Dashboard

## Project Goal

Build a small, secure MERN application for the CDC Developer Selection Assignment.

The app has three roles:

- **Admin**: creates Faculty and Student accounts and views their lists.
- **Faculty**: logs in and views only their own profile.
- **Student**: logs in and views only their own profile plus a unique QR code.

Keep the scope small. Do **not** build attendance scanning, attendance recording, course management, or public Admin registration.

## Required Stack

- React with JavaScript (Vite recommended)
- Tailwind CSS
- Node.js and Express.js
- MongoDB with Mongoose
- bcrypt (or equivalent) for password hashing
- JWT authentication, or a clearly documented secure session-based alternative
- Git and GitHub

Use environment variables for secrets and the MongoDB URI. Commit `.env.example`, never the real `.env`.

## Build Order

Work through these phases in order. Finish and verify each phase before starting the next. Do not generate the whole application in one pass.

### Phase 1 — Inspect and Scaffold

1. Inspect the existing repository before changing anything.
2. If it is empty, create a `client/` React + Vite app and a `server/` Express app.
3. Set up Tailwind CSS in the client.
4. Add clear package scripts for development and production.
5. Add `.gitignore` entries for `node_modules`, build output, `.env`, and other generated files.
6. Create `.env.example` with placeholders only.
7. Keep frontend and backend code organized by responsibility.

**Acceptance checks**
- Client and server install successfully.
- Both have clear run scripts.
- No real secrets are committed.

### Phase 2 — Backend Foundation and Database

1. Configure Express and JSON request parsing.
2. Connect to MongoDB through Mongoose using an environment variable.
3. Create a `User` model with:
   - `name`
   - `email` (unique)
   - `passwordHash`
   - `role` (`admin`, `faculty`, or `student`)
   - `rollNumber` (required and unique for students)
   - `studentQrId` (unique for students)
   - timestamps
4. Add schema validation and handle duplicate-key errors.
5. Never return `passwordHash` in API responses.

**Acceptance checks**
- Server starts and reports database connection errors clearly.
- Invalid fields and duplicate email/roll number are handled safely.
- User responses omit password hashes.

### Phase 3 — Authentication and Initial Admin

1. Implement `POST /api/auth/login`.
2. Verify passwords against stored hashes.
3. Issue and verify JWTs, or implement the documented secure session alternative.
4. Implement `GET /api/auth/me`.
5. Implement logout behavior appropriate to the chosen auth approach.
6. Add authentication middleware that derives the current user from verified credentials.
7. Add role-check middleware for Admin-only endpoints.
8. Create a seed script that creates one initial Admin account from environment variables or documented local setup values.
9. Do not create a public Admin-registration endpoint.

**Acceptance checks**
- Seeded Admin can log in.
- Invalid credentials are rejected with a useful error.
- Protected endpoints reject unauthenticated requests.
- The backend, not frontend-supplied role/user IDs, determines the authenticated user.

### Phase 4 — Admin APIs

Implement and document these routes (equivalent route names are acceptable):

- `POST /api/admin/faculty` — Admin only; create a Faculty account.
- `GET /api/admin/faculty` — Admin only; list Faculty accounts.
- `POST /api/admin/students` — Admin only; create a Student account.
- `GET /api/admin/students` — Admin only; list Student accounts.
- `GET /api/profile/me` — authenticated user; return only their own profile.

Requirements:
- Validate name, email, password/temporary password, role-specific fields, and student roll number.
- Hash passwords before saving.
- Enforce unique email and student roll number.
- Generate a unique, non-sensitive student QR identifier for each student.
- Return useful success and validation messages.
- Never trust a user ID or role supplied by the frontend to decide access.

**Acceptance checks**
- Admin can create and list Faculty and Student accounts.
- Faculty and Student requests to Admin endpoints receive a forbidden response.
- Duplicate email and duplicate student roll number are rejected.
- A user cannot retrieve another user's profile by altering a URL or request body.

### Phase 5 — Frontend Authentication and Shared UI

1. Build a responsive login page with email and password inputs.
2. Show loading, invalid-credentials, and API-error states.
3. Create a shared API client and organized API functions.
4. Add authentication state/context.
5. Add protected routes and role-based route handling for `admin`, `faculty`, and `student`.
6. Add reusable components such as `Navbar`, `FormInput`, loading states, and error/success messages.
7. Add logout and appropriate handling for expired/invalid authentication.

**Acceptance checks**
- Login calls the real backend.
- Users land on the dashboard appropriate to their verified role.
- Unauthenticated users cannot access protected pages.
- Frontend route guards improve navigation but are not treated as the security boundary; Express must enforce permissions.

### Phase 6 — Role Dashboards

#### Admin dashboard
- Form to create Faculty accounts.
- Form to create Student accounts.
- List of Faculty accounts.
- List of Student accounts.
- Input validation and success/error messages.
- Logout.

#### Faculty dashboard
- Show the logged-in Faculty member's name, email, and role only.
- Logout.

#### Student dashboard
- Show the logged-in Student's name, email, roll number, and role.
- Display a QR code generated from the student's unique, non-sensitive identifier.
- Do not encode passwords, JWTs, session identifiers, or other secrets in the QR code.
- QR scanning and attendance features are out of scope.
- Logout.

**Acceptance checks**
- Each role sees the correct dashboard.
- Faculty and Student users only see their own profile.
- Each Student has a unique QR identifier and displayed QR code.
- Layouts work on desktop and mobile.

### Phase 7 — Security and End-to-End Testing

Test all of the following:

- [ ] Seeded Admin can log in.
- [ ] Invalid credentials are rejected.
- [ ] Admin can create Faculty and Student accounts.
- [ ] Duplicate emails are rejected.
- [ ] Duplicate Student roll numbers are rejected.
- [ ] New Faculty can log in and view only their own profile.
- [ ] New Student can log in and view their profile and QR code.
- [ ] Each Student receives a unique QR code.
- [ ] Faculty cannot access Admin-only APIs.
- [ ] Students cannot access Admin-only APIs.
- [ ] Users cannot access another user's profile by changing a URL or request body.
- [ ] Password hashes never appear in API responses.
- [ ] Logout and protected-page behavior work correctly.
- [ ] Loading, empty, validation, and server-error states are understandable.

Fix security and correctness issues before spending time on decorative UI work.

### Phase 8 — UI Polish and Documentation

1. Make the UI clean, consistent, accessible, and responsive.
2. Keep components reusable and code readable.
3. Add a `README.md` containing:
   - Project overview and features
   - Tech stack
   - Setup and run instructions
   - Required environment variables
   - MongoDB setup
   - Admin seed instructions
   - API endpoint list
   - Testing steps
   - Screenshots or demo instructions
   - AI tools used and how they were used
   - Known limitations
4. Capture screenshots or prepare a 3–5 minute demo.
5. Provide demo credentials safely; never commit real secrets.
6. Verify `.env` and credentials are not tracked by Git.

**Acceptance checks**
- A reviewer can follow the README to run the project.
- Demo shows Admin account creation, Faculty login/profile, and Student login/profile with QR.
- GitHub repository contains the client, server, README, and `.env.example`, but no real secrets.

## Suggested Structure

Adapt to the existing repository if one already exists. Do not reorganize files unnecessarily.

```text
project/
  server/
    src/
      config/db.js
      models/User.js
      controllers/
        auth.controller.js
        admin.controller.js
        profile.controller.js
      routes/
        auth.routes.js
        admin.routes.js
        profile.routes.js
      middleware/
        auth.middleware.js
        role.middleware.js
        error.middleware.js
      scripts/seedAdmin.js
      app.js
      server.js
    .env.example
    package.json
  client/
    src/
      api/
        apiClient.js
        auth.api.js
        admin.api.js
        profile.api.js
      components/
        Navbar.jsx
        ProtectedRoute.jsx
        RoleRoute.jsx
        FormInput.jsx
      pages/
        LoginPage.jsx
        AdminDashboard.jsx
        FacultyDashboard.jsx
        StudentDashboard.jsx
      context/AuthContext.jsx
      App.jsx
      main.jsx
    package.json
  README.md
```

## API Contract

Use these endpoint names unless there is a clear reason to choose equivalent names:

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate a user |
| `POST` | `/api/auth/logout` | Authenticated, if needed | Log out / clear session |
| `GET` | `/api/auth/me` | Authenticated | Return current user's basic details |
| `POST` | `/api/admin/faculty` | Admin only | Create Faculty account |
| `GET` | `/api/admin/faculty` | Admin only | List Faculty accounts |
| `POST` | `/api/admin/students` | Admin only | Create Student account |
| `GET` | `/api/admin/students` | Admin only | List Student accounts |
| `GET` | `/api/profile/me` | Authenticated | Return the current user's own profile |

## Agent Working Rules

- Start by inspecting the repository and reporting what already exists.
- Work one phase at a time in the order above.
- Before moving to the next phase, run relevant checks and report their results.
- Prefer simple, maintainable code suitable for a first-year developer to understand and explain.
- Explain important architectural and security decisions briefly.
- Do not invent successful test results; run tests or clearly state what was not tested.
- Do not silently skip acceptance checks.
- Do not add features outside the assignment scope without asking first.
- Do not hardcode secrets, tokens, passwords, or database credentials.
- Do not store plaintext passwords or expose password hashes.
- Do not trust frontend role values or user IDs for authorization.
- Do not put all backend logic in one file.
- Use meaningful names, consistent formatting, and small functions.
- If a requirement is ambiguous, choose the smallest secure implementation and document the decision.
- If a command fails, inspect the error, fix the cause, and rerun it where practical.

## Definition of Done

The project is complete only when:

1. Admin, Faculty, and Student login flows work.
2. Admin can create and list Faculty and Student accounts.
3. Faculty and Students can view only their own profiles.
4. Student dashboards display unique QR codes containing only non-sensitive identifiers.
5. Backend authorization and password hashing are implemented and tested.
6. The required checks pass or any uncompleted checks are clearly documented.
7. README, `.env.example`, screenshots/demo, and GitHub submission are ready.
