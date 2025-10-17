## Neximprove - Customer Onboarding MVP

Tech stack: React (Vite) + TailwindCSS, Node.js (Express), PostgreSQL, JWT auth, bcrypt password hashing.

### Features
- Broker registration/login with secure bcrypt hashing and HTTP-only JWT cookie
- Dashboard to onboard customers (name, email, GSTIN) and list broker-scoped customers
- Admin endpoints to list all users and customers (admin only)
- Mobile-friendly Tailwind UI

### Architecture
- `backend`: Express API, routes under `/api/*`, PostgreSQL via `pg`, schema: `users`, `customers`. JWT stored in HTTP-only cookie. Zod for validation. CORS enabled for `http://localhost:5173`.
- `frontend`: Vite React. Auth context manages session with `/api/auth/me`. Pages: Login, Register, Dashboard, Admin.

### Security
- Passwords hashed using `bcryptjs` with 10 salt rounds
- JWT signed with `JWT_SECRET` and set as HTTP-only cookie; `secure` flag toggled by `COOKIE_SECURE`
- Server validates inputs using Zod; unique email enforced at DB; role-guarded admin routes

### Local Setup
1) Start Postgres
```bash
docker compose up -d db
```
It exposes `postgresql://postgres:1234@localhost:5432/Onboarding_System`.

2) Backend env
Create `backend/.env` based on:
```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/neximprove
JWT_SECRET=change_me
COOKIE_SECURE=false
```

3) Install & run
```bash
cd backend && npm i && npm run dev
```
Backend creates tables on boot and serves on `http://localhost:4000`.

4) Frontend
```bash
cd frontend && npm i && npm run dev
```
Open `http://localhost:5173`.

### Demo Flow
1. Register a broker at `/register` → redirected to dashboard
2. Add customers (Name, Email, GSTIN) → see them listed
3. Optional: set your user `role` to `admin` in DB to access `/admin`

**Demo Admin Account**

For testing admin endpoints, you can use the following credentials:

```
Email:    Admin@gmail.com
Password: 123456789
```
> Tip: You may need to manually update a user's role to `admin` in the database if registering this account yourself.

### Notes
- Health check: `GET /api/health`
- Admin: `GET /api/admin/users`, `GET /api/admin/customers`


