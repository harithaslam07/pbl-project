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

## Backend Deployment on Render
1. Push your project to GitHub.
2. In Render, create a new `Web Service`.
3. Connect the GitHub repo and set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add these environment variables in Render:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_secure_secret`
   - `JWT_EXPIRES_IN=1d`
   - `DB_HOST=...`
   - `DB_PORT=3306`
   - `DB_USER=...`
   - `DB_PASSWORD=...`
   - `DB_NAME=...`
   - `CORS_ORIGIN=https://your-frontend-domain`
5. Do not set `PORT` manually on Render. Render provides it automatically.
6. After deploy, test:
   - `https://your-render-service.onrender.com/api/health`

Notes:
- Your current backend uses MySQL, so Render needs access to a MySQL database hosted on Render or an external provider.
- If you deploy the frontend separately, update its `VITE_API_URL` to `https://your-render-service.onrender.com/api`.

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
