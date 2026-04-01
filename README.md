# Academic Carbon Footprint Tracker

Full-stack implementation based on your SRS.

## Stack
- Frontend: React + Vite + Recharts
- Backend: Express.js + JWT + bcrypt
- Database: MySQL

## Project Structure
- `backend/` Express REST API
- `frontend/` React app

## 1) Database Setup
1. Create MySQL database and tables:
   - Run: `backend/db/schema.sql`
2. This script also inserts default emission factors.

## 2) Backend Setup
1. Open terminal in `backend`
2. Install dependencies:
```bash
npm install
```
3. Create `.env` from `.env.example` and fill MySQL credentials + JWT secret.
4. Start backend:
```bash
npm run dev
```
Backend runs on `http://localhost:5000` by default.

## 3) Frontend Setup
1. Open terminal in `frontend`
2. Install dependencies:
```bash
npm install
```
3. Create `.env` from `.env.example`.
4. Start frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173` by default.

## Key Features Implemented
- User register/login with JWT auth
- Role-based access (`student`, `faculty`, `admin`)
- Activity CRUD (transportation/electricity/paper/device)
- Automatic carbon emission calculation from DB factors
- Dashboard analytics + charts + suggestions
- Monthly report API + CSV/PDF download
- Admin panel:
  - Manage users
  - Institution-level statistics
  - Manage emission factors

## Main API Routes
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Activities: `/api/activities`
- Dashboard: `/api/dashboard/me`
- Reports: `/api/reports/monthly`, `/api/reports/csv`, `/api/reports/pdf`
- Admin: `/api/admin/users`, `/api/admin/stats`, `/api/admin/factors`

## Notes
- Emission formula used: `emission = value * factor`
- Current implementation keeps CSV/PDF download secured via bearer token fetch.
