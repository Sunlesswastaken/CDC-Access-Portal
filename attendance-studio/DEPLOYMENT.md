# Web deployment

React renders the pages in a browser. FastAPI serves the API and the built frontend from one origin. Python is required only on the server for Excel/PDF parsing, deterministic comparison and report generation. Users need only a browser.

## Server

Install requirements.txt and build the frontend with `npm ci` and `npm run build` from frontend/. Then run:

```
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Use one worker for the current temporary report cache. Reports expire after a server restart or when evicted from the 16-report cache. Set `NOMINAL_ROLLS_DIR` to an absolute path containing the complete database to override the bundled snapshot.

Alternatively, from this directory:

```
docker build -t attendance-studio .
docker run --rm -p 8000:8000 attendance-studio
```

The Docker configuration is provided but must be tested on the target server. Place HTTPS/reverse proxy configuration in the hosting environment. No public deployment has been made.

## Adding pages and login later

Page components live in frontend/src/pages/. Register new pages in frontend/src/App.jsx. Hash URLs work with the current static-file server and can be bookmarked.

Before opening this student-data service to multiple authenticated users, implement login/session checks on the API, enforce report ownership, and replace the shared in-memory report cache with user-scoped database storage. Frontend login screens alone do not protect the API. The current version has no authentication and is intended for local or controlled private use.
