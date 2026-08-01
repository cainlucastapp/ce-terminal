# CE Terminal

CE Terminal is a continuing-education certificate management app for real estate CE providers, currently scoped to Nevada. Providers create courses, manage attendee rosters, and generate certificates; students (real estate agents) can look up and view their own certificates without needing an account.

## Features

- **Provider accounts** — signup/login with session-based auth; every course and attendee is scoped to its owning provider.
- **Course management** — create, edit, and delete courses (type, category, hours, sponsor, signer, certificate template), matching Nevada's CE requirements.
- **Attendee management** — add, edit, and delete attendees individually, or bulk-import a class roster from a CSV file.
- **Certificate generation** — completion certificates are generated on demand as a PDF and opened in a new tab, not pre-rendered or stored.
- **Public certificate lookup** — students search by state and license number to find and view their own certificates; no login required.
- **Attendee search** — a course's full attendee roster loads once and can be filtered in real time by name, license number, or completion date, without losing the ability to page through the full list.
- **Confirmation dialogs** — deleting a course or attendee requires an explicit, clearly-worded confirmation (course deletion also states how many attendees will be removed with it).

## Tech stack

- **Frontend:** React 19, Vite, React Router. CSS.
- **Backend:** Flask, Flask-SQLAlchemy, Flask-Login, Flask-Migrate, Flask-CORS, bcrypt.
- **Database:** SQLite.
- **Required packages:** `@react-pdf/renderer` for certificate PDFs, `react-csv-importer` for attendee bulk import.

## Project structure

```
client/   React frontend (Vite)
api/      Flask backend (REST API)
```

## Getting started

### Backend (api/)

```
cd api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python seed.py
python run.py
```

The API runs at `http://localhost:5000`.

Environment variables (see `api/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Flask session signing key | `dev` |
| `DATABASE_URL` | Database connection string | local SQLite file |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173` |

### Frontend (client/)

```
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Environment variables (see `client/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the API | `http://localhost:5000/api` |

### Test login

After running `python seed.py`:

- **Email:** test@example.com
- **Password:** password123


## Future Features

- Sortable attendee lists.
- A public directory of providers who use CE Terminal.
- Manual attendee input.
- Expand to other states.
- Billing system for providers.
- User Profiles / Update Info