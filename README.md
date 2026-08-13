# AWS Route53 Clone

A full-stack clone of the AWS Route53 DNS management console.

## Tech Stack
- **Frontend:** Next.js (TypeScript), Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** SQLite

## Prerequisites
- Node.js v18+
- Python 3.9+

## Setup

### Backend
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Backend runs on `http://127.0.0.1:8000` — both servers must be running simultaneously.

## Features
- JWT authentication (register, login, logout)
- Full CRUD for Hosted Zones (search, pagination)
- Full CRUD for DNS Records (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA) with type filter
- AWS-accurate UI (sidebar, tables, modals, breadcrumbs)
- Dashboard with live stats

## Database Schema
| Table | Columns |
|---|---|
| `users` | id, email, password_hash |
| `hosted_zones` | id, name, description, user_id |
| `dns_records` | id, hosted_zone_id, name, type, value, ttl |

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register user |
| POST | `/login` | Login → returns JWT |
| GET | `/stats` | Zone + record counts |
| GET/POST | `/hosted-zones` | List / Create zones |
| GET/PUT/DELETE | `/hosted-zones/{id}` | Read / Update / Delete zone |
| GET | `/hosted-zones/{id}/records` | List records |
| POST | `/records` | Create record |
| PUT/DELETE | `/records/{id}` | Update / Delete record |
