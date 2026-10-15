# CDC Developer Selection Assignment

## Mini MERN Authentication & Role-Based Dashboard

**Deadline:** Sunday, 11:59 PM\
**Technology:** MongoDB, Express.js, React, Node.js, Tailwind CSS\
**Submission:** GitHub repository + README + screenshots or short demo

------------------------------------------------------------------------

## 1. Objective

Build a small MERN application to demonstrate authentication, role-based
access, basic account management, and a clean React UI.

The application has three roles: **Admin, Faculty, and Student**. Admin
creates Faculty and Student accounts. Faculty and students can log in
and view only their own profile. Each student must also have a unique QR
code displayed on their dashboard.

This is a deliberately small assignment. Do not add attendance scanning
or course management.

## 2. Required Technology

- React with JavaScript
- Tailwind CSS
- Node.js and Express.js
- MongoDB with Mongoose
- Password hashing (for example, bcrypt)
- JWT-based authentication or a clearly explained secure session-based
  approach
- Git and GitHub

Vite is recommended for setting up React.

## 3. Functional Requirements

### A. Login and authentication

- Provide a login page with email and password fields.
- Support three roles: `admin`, `faculty`, and `student`.
- Authenticate credentials against the backend.
- Show a useful error for invalid credentials.
- Keep the user logged in appropriately and provide logout.
- Protect authenticated pages.
- Enforce role permissions on the backend, not only by hiding frontend
  buttons.

Seed one initial Admin account using a script. Do not provide public
Admin registration.

### B. Admin dashboard

Admin must be able to: - Log in and access the Admin dashboard. - Add a
Faculty account. - Add a Student account. - View a list of created
Faculty accounts. - View a list of created Student accounts. - Log out.

When creating an account, collect basic fields such as name, email, roll
number (students only), and an initial password or securely generated
temporary password.

Requirements: - Email must be unique. - Student roll number must be
unique. - Passwords must be hashed before storage. - Only Admin can
create or list Faculty and Student accounts. - Validate inputs and
display useful success/error messages.

### C. Faculty dashboard

When a Faculty member logs in, they can: - View their own profile
details created by Admin, such as name and email. - Log out.

Faculty must not be able to view other Faculty profiles, Student
profiles, or Admin-only pages.

### D. Student dashboard

When a Student logs in, they can: - View their own profile details
created by Admin, such as name, email, and roll number. - View a unique
QR code associated with their account. - Log out.

Each student must have a unique QR code. The QR should contain a
non-sensitive unique student identifier, not a password or
authentication token. QR scanning and attendance recording are out of
scope.

## 4. Expected Flow

1. Start the React frontend, Express backend, and MongoDB.
2. Log in using the seeded Admin credentials.
3. Admin creates a Faculty account and a Student account.
4. Log out of Admin.
5. Log in as the new Faculty and confirm only that Faculty member's
   profile is visible.
6. Log in as the Student and confirm their profile and unique QR code
   are visible.
7. Verify Faculty and Student users cannot access Admin APIs or another
   user's profile.

## 5. Suggested Database Model

A single `User` model with a `role` field is sufficient.

Suggested fields: - `name` - `email` (unique) - `passwordHash` - `role`
(`admin`, `faculty`, or `student`) - `rollNumber` (required for
students; unique) - `studentQrId` (unique identifier for students) -
timestamps

Use schema validation and unique indexes. Do not store plaintext
passwords. Create the initial Admin through a seed script, not public
registration.

## 6. Suggested Project Structure

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

This is a suggested structure. Keep models, routes, controllers,
middleware, and React components organized by responsibility. Do not put
the entire backend in one file.

## 7. Minimum API Contract

You may use different endpoint names, but document the routes and
implement equivalent functionality.

  -----------------------------------------------------------------------------

  Method            Endpoint                Access            Purpose

  ----------------- ----------------------- ----------------- -----------------

  POST              `/api/auth/login`       Public            Authenticate a
                                                              user

  POST              `/api/auth/logout`      Authenticated, if Log out or clear
                                            needed            session

  GET               `/api/auth/me`          Authenticated     Return logged-in
                                                              user's basic
                                                              details

  POST              `/api/admin/faculty`    Admin only        Create Faculty
                                                              account

  GET               `/api/admin/faculty`    Admin only        List Faculty
                                                              accounts

  POST              `/api/admin/students`   Admin only        Create Student
                                                              account

  GET               `/api/admin/students`   Admin only        List Student
                                                              accounts

GET               `/api/profile/me`       Authenticated     Return current
                                                              user's own
                                                              profile
-----------------------------------------------------------------------------

The backend must determine the current user from verified authentication
credentials. Do not trust a user ID or role supplied by the frontend to
decide whose profile is returned.

## 8. Security and Validation

- Hash passwords before storing them.
- Keep auth secrets and MongoDB URI in environment variables.
- Commit `.env.example`, never the real `.env`.
- Do not provide public Admin registration.
- Protect Admin endpoints with authentication and an Admin role check.
- Return only the current user's profile from the self-profile
  endpoint.
- Never expose password hashes in API responses.
- Validate email, required fields, role values, and student roll
  numbers.
- Handle duplicate email/roll number errors gracefully.
- Enforce authorization in Express middleware, not just React.

## 9. Basic UI Requirements

Use reusable React components and Tailwind CSS. The UI should be clear
and usable, not necessarily elaborate.

**Login page** - Email and password inputs. - Login button. - Loading
and invalid-credentials states.

**Admin dashboard** - Simple navigation. - Form to create Faculty
accounts. - Form to create Student accounts. - Faculty list and Student
list. - Success and validation messages.

**Faculty dashboard** - Name, email, role. - Logout button.

**Student dashboard** - Name, email, roll number, role. - Unique QR
code. - Logout button.

Make pages responsive and provide clear empty, loading, and error
states.

## 10. Testing Checklist

- [ ] Seeded Admin can log in.
- [ ] Invalid credentials are rejected.
- [ ] Admin can create Faculty and Student accounts.
- [ ] Duplicate emails are rejected.
- [ ] Duplicate student roll numbers are rejected.
- [ ] Newly created Faculty can log in and view their own profile.
- [ ] Newly created Student can log in and view their own profile and
  QR code.
- [ ] Each student receives a unique QR code.
- [ ] Faculty cannot access Admin-only APIs.
- [ ] Student cannot access Admin-only APIs.
- [ ] A user cannot request another user's profile by changing a URL
  or request body.
- [ ] Password hashes are not included in API responses.
- [ ] Logout and protected-page behavior work correctly.

## 11. AI-Assisted Development

AI-assisted development and vibe coding are allowed. You may use
ChatGPT, Claude, Cursor, GitHub Copilot, or similar tools.

However: - You must understand the code you submit. - Test AI-generated
code rather than assuming it works. - Be ready to explain the login
flow, role-based authorization, database model, and QR generation. - Be
prepared to make a small change or debug an issue during the review. -
Mention which AI tools you used and how you used them in your README.

Using AI is fine; submitting code you cannot explain will affect your
evaluation.

## 12. Submission Requirements

**Deadline: Sunday, 11:59 PM.**

Submit: 1. **GitHub repository link** containing frontend and backend
source code. 2. **README.md** with project overview, stack, setup
instructions, environment variables, Admin seed instructions, API
endpoints, screenshots, AI tools used, and known limitations. 3. **Demo
credentials** for evaluation, shared safely and not committed as
production secrets. 4. **Screenshots or a 3--5 minute demo** showing
Admin account creation, Faculty login/profile, and Student login/profile
with QR code.

Do not commit `.env` files, passwords, API keys, or other secrets to
GitHub.

## 13. Evaluation Rubric

  Area                                                                                                                                     Weight

  -------------------------------------------------- ----------

  Login and authentication flow                                                                                             20%
  Role-based access and backend security                                                                           25%
  Admin account creation and listing                                                                                    20%
  Faculty/Student dashboards and student QR code                                                         15%
  Code structure and React component design                                                                  10%
  README, testing, and ability to explain the code                                                             10%
  **Total**                                                                                                                                      **100%**

The focus is not on building a large product. It is on demonstrating a
working MERN application with clear architecture and correct role
permissions.

## 14. Final Review Questions

Be ready to explain: 1. What happens when a user clicks Login? 2. How
does the backend know whether the user is Admin, Faculty, or Student? 3.
How do you prevent a Student from calling an Admin API? 4. Why must
passwords be hashed? 5. How does the profile page ensure a user sees
only their own details? 6. How is each student's QR code made unique? 7.
What happens if two accounts use the same email? 8. What did AI help you
build, and how did you verify it?

------------------------------------------------------------------------

### Final Note

Keep the implementation small and complete. Prioritize correct
authentication, role permissions, clean React components, organized
Express code, and an implementation you can explain over extra features
or visual polish.
