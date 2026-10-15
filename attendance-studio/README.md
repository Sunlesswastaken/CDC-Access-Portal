# Attendance Studio — webpage

Double-click `Start Attendance Web.cmd` in the parent folder. The local webpage opens at http://127.0.0.1:8877. Keep its server window open while using the app.

On another Windows PC: install Python 3.11 or newer with the Python launcher, run `Setup Attendance Web.cmd` once (internet required for setup), then use the Start launcher. No Excel installation is required. The built webpage is included; Node is needed only to edit/rebuild the frontend.

## Comparison rule

Only confirmed CDC students in the uploaded session are compared. Students without a CDC batch, unknown Class IDs, and other Class students are ignored.

A discrepancy is a CDC-present student whose roll number appears in the Class absentee list for that hour. Students absent from both sessions do not count. Counts use sets of roll numbers, never subtraction of totals. Missing names do not prevent a confirmed CDC student from being counted.

For a CDC absentee-only PDF, the matching nominal-roll cohort minus CDC absentees supplies the present students. A CDC register restricts the cohort to its listed students. Use complete attendance files for the same date, semester and session.

## Files and reports

Upload one CDC file and up to 20 Class files. Both accept PDF, XLSX, XLS and CSV, up to 10 MB per file. Class files can be added one at a time. CDC summary PDFs and department activity tables use the supplied college layouts. Scanned/image-only PDFs require OCR first.

Class activity columns: Date, Period, Section, Absentees, Staff. FN uses periods 1–3; AN uses 4–6. Example section: AIML-V-SEM-A.

The webpage omits the college banner, missing-attendance selector, discrepancy formula caption and database/coverage notes panel. Essential upload/validation errors remain visible.

PDF retains the college letterhead and footer. Text uses embedded Aptos: CDC heading 16 pt, semester title and session 12 pt, table 9 pt bold. PDF has no warning banner or notes. The original letterhead is an image and retains its original lettering. Excel retains a student ledger and audit sheets. Both exports follow branch/hour filters.

## Database and source

The `NOMINAL ROLLS` folder beside `attendance-studio` is the editable database. Save changes and restart the web server. Keep the supplied semester folders and master filenames containing `STUDENTS LIST`. An absent/empty folder uses the bundled snapshot. Names may be blank; CDC batch and section must be valid for the selected cohort.

Python API: backend/main.py; comparison: backend/college.py; report layout: backend/college_reports.py; webpage: frontend/src/pages/AttendancePage.jsx. The supplied Aptos files and license are in assets/fonts.

Run tests: `python -m unittest discover -s tests -q`.
Server deployment and future login/page structure: see DEPLOYMENT.md.
