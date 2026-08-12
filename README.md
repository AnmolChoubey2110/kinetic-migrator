# Kinetic Migrator

Monorepo split:

- `frontend/` — Next.js UI (Register / Sign In)
- `backend/` — Node.js + Express auth API (PostgreSQL + JWT)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend

1. Configure env:

```bash
cd backend
cp .env.example .env
```

For **AWS RDS IAM auth** (recommended for this project), `.env` should include:

```env
DB_AUTH=iam
RDSHOST=database-1-instance-1.c3eyk6cayb17.ap-northeast-1.rds.amazonaws.com
RDSPORT=5432
RDSUSER=postgres
RDSDATABASE=postgres
AWS_REGION=ap-northeast-1
DB_SSL=require
```

AWS credentials must be available to the Node process (same identity that can run
`aws rds generate-db-auth-token`), via env vars or `~/.aws/credentials`.
The IAM principal also needs `rds-db:connect` on the DB user.

2. Apply the schema (no `psql` required):

```bash
npm run db:migrate
```

Equivalent manual `psql` (if AWS CLI + psql are on PATH):

```powershell
$RDSHOST = "database-1-instance-1.c3eyk6cayb17.ap-northeast-1.rds.amazonaws.com"
$token = aws rds generate-db-auth-token --hostname $RDSHOST --port 5432 --username postgres --region ap-northeast-1
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "host=$RDSHOST port=5432 dbname=postgres user=postgres sslmode=require password=$token" -f sql/schema.sql
```

3. Install and run:

```bash
npm install
npm run dev
```

API listens on [http://localhost:4000](http://localhost:4000) by default.

### Auth endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | No | Create user (`email`, `password`) |
| `POST` | `/api/auth/login` | No | Returns JWT + user |
| `GET` | `/api/auth/me` | Bearer JWT | Current user |

Example register:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"you@example.com\",\"password\":\"secret123\"}"
```

Example login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"you@example.com\",\"password\":\"secret123\"}"
```

Example protected route:

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

The Sign In / Register screens still use local mock submit handlers; wire them to these endpoints when ready.
