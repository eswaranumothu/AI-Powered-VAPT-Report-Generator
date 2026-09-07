# AI-Powered VAPT Report Generator

A full-stack platform for producing professional **Vulnerability Assessment and
Penetration Testing (VAPT)** reports. Security teams manage projects, catalogue
findings with evidence, and export a clean, standardised PDF report — with an
AI assistant that drafts vulnerability write-ups and evidence step descriptions.

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL, JWT auth, ReportLab PDF engine
- **Frontend:** React 19 + TypeScript + Vite + Material UI
- **AI:** Google Gemini for vulnerability and evidence text generation

---

## Table of contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running the app](#running-the-app)
- [Generating a report](#generating-a-report)
- [Documentation](#documentation)

---

## Features

### Projects & findings
- Create and track assessment projects (code, client, application, scope, dates, environment details).
- Project stages (`Draft` / `Stage 1`) and per-project auditor assignment.
- Add vulnerability findings with severity, CVSS score & vector, CWE, OWASP category, description, business impact, recommendation and remediation.
- Group evidence into **cases** and **steps**, each with a screenshot and caption.

### Master vulnerability library
- Reusable catalogue of common vulnerabilities so findings can be added consistently across projects.
- Read-only for auditors, editable by admins.

### AI assistance
- **Generate vulnerability** — type a title (e.g. `SSRF`) and the assistant fills in severity, CVSS, CWE, OWASP, description, impact, recommendation and remediation.
- **Generate evidence step** — turns a screenshot and short note into a clear, report-ready step description.

### Reporting
- One-click **PDF export** per project in a simple, standard corporate format:
  cover page, audit details, confidentiality notice, document control,
  severity summary with chart, executive summary table, and detailed findings
  with proof-of-concept evidence.

### Access control
- JWT authentication with `ADMIN` and `AUDITOR` roles.
- Forced password change on first login; admin-managed user accounts.

---

## Screenshots

> Images live in [`docs/screenshots/`](docs/screenshots/).

### Dashboard
<img width="955" height="409" alt="Screenshot 2026-09-07 150419" src="https://github.com/user-attachments/assets/bc581b62-335a-4db3-adcf-599e9a0295c4" />


### AI vulnerability generation
Enter a short title…

<img width="647" height="413" alt="Screenshot 2026-09-07 150435" src="https://github.com/user-attachments/assets/31a96a04-79b6-4f00-a702-77457c67b9de" />


…and let the assistant draft the full write-up:

<img width="654" height="415" alt="Screenshot 2026-09-07 150444" src="https://github.com/user-attachments/assets/0be50ff1-b5d7-4896-9451-bfb6bf12622e" />


### Project details & findings
<img width="797" height="362" alt="Screenshot 2026-09-07 150503" src="https://github.com/user-attachments/assets/23b75264-5ee3-4305-a531-49b07997316c" />


### Evidence with AI step generation
<img width="324" height="221" alt="Screenshot 2026-09-07 150518" src="https://github.com/user-attachments/assets/3831f31b-d53b-4558-a308-d5983ac9bd12" />



---

## Architecture

```
React (Vite) SPA  ──HTTP/JSON──►  FastAPI  ──►  PostgreSQL
                                    │
                                    ├─►  Google Gemini      (AI text generation)
                                    └─►  ReportLab           (PDF generation)
```

- The SPA calls the API at `VITE_API_BASE_URL`.
- Uploaded screenshots are stored on disk under `uploads/` and served at `/uploads`.
- Generated PDFs are written to `backend/generated_reports/`.

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/            # auth, users, projects, findings, evidence, ai, report routes
│   │   ├── core/             # config, security, roles
│   │   ├── database/         # engine, session, base
│   │   ├── models/           # SQLAlchemy models
│   │   ├── repositories/     # data-access layer
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/
│   │   │   ├── ai/           # Gemini client + prompt builders
│   │   │   ├── report/       # PDF builder (brand, sections, generator)
│   │   │   └── storage/      # file storage
│   │   └── main.py
│   ├── alembic/              # database migrations
│   ├── scripts/seed_admin.py # seed initial admin + auditor
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # typed API clients
│   │   ├── components/       # layout, shared UI
│   │   ├── context/          # auth context
│   │   └── pages/            # Dashboard, Projects, ProjectDetails, MasterVulnerabilities, Users, Login
│   └── package.json
├── docs/                     # design documents
├── docker-compose.yml        # PostgreSQL + pgAdmin
└── .env.example
```

---

## Getting started

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 17 (or use the provided `docker-compose.yml`)
- A Google Gemini API key (for AI features)

### 1. Clone

```bash
git clone https://github.com/eswaranumothu/AI-Powered-VAPT-Report-Generator.git
cd AI-Powered-VAPT-Report-Generator
```

### 2. Environment

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
# edit .env with your DB credentials, SECRET_KEY and GEMINI_API_KEY
```

### 3. Database

Using Docker:

```bash
docker compose up -d postgres
```

Or point `DATABASE_URL` at an existing PostgreSQL instance.

### 4. Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Unix:    source venv/bin/activate
pip install -r requirements.txt

alembic upgrade head          # apply migrations
python scripts/seed_admin.py  # create initial admin + auditor
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000` (docs at `/docs`).

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Configuration

All backend configuration is read from `.env` (see [`.env.example`](.env.example)):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLAlchemy PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret (use a long random value) |
| `ALGORITHM` | JWT algorithm, e.g. `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access-token lifetime |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model name |
| `POSTGRES_*`, `PGADMIN_*` | Used by `docker-compose.yml` |

Frontend (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend base URL (default `http://localhost:8000`) |

The default seed accounts are created by `scripts/seed_admin.py`
(`admin@example.com` / `auditor@example.com`) and are forced to change their
password on first login. **Change these before any real use.**

---

## Running the app

| Service | Command | URL |
|---------|---------|-----|
| PostgreSQL | `docker compose up -d postgres` | `localhost:5432` |
| Backend | `uvicorn app.main:app --reload` (in `backend/`) | `http://localhost:8000` |
| Frontend | `npm run dev` (in `frontend/`) | `http://localhost:5173` |

---

## Generating a report

1. Create a project and set its client, application, scope and dates.
2. Add findings — use **Generate** to have the AI draft the write-up, then edit.
3. Upload evidence screenshots and organise them into cases/steps.
4. Open the project and click **View PDF Report**.

The PDF is produced by `backend/app/services/report/` and saved to
`backend/generated_reports/<project_code>.pdf`.

---

## Documentation

Design documents are in [`docs/`](docs/):

- [`SOFTWARE_DESIGN.md`](docs/SOFTWARE_DESIGN.md)
- [`API_DESIGN.md`](docs/API_DESIGN.md)
- [`DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md)
- [`AI_WORKFLOW.md`](docs/AI_WORKFLOW.md)

---
