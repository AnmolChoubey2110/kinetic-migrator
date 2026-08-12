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

### Validation rules endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/rules/business-objects` | Bearer | Predefined BO list |
| `POST` | `/api/rules/generate` | Bearer | Upload Excel + BO → parse JSON → Grok rules (**not saved**) |
| `POST` | `/api/rules/save` | Bearer | Persist reviewed rules JSON to DB |
| `GET` | `/api/rules` | Bearer | List saved rule sets |
| `GET` | `/api/rules/:id` | Bearer | Get one saved rule set |

Admin UI: [http://localhost:3000/admin/rules](http://localhost:3000/admin/rules) (sign in first).

Excel columns: **Key**, **Field Name**, **Data Type**, **Length**, **Default Value** (`Key=X` marks a key field).  
Sample file: `samples/mm-fields-sample.xlsx`.

Generate returns **common predefined rules** (trim / null-empty / duplicate) for every field plus **AI additional rules**. Nothing is saved until Admin clicks **Save**.

Grok / xAI settings in `backend/.env`:

```env
GROK_API_KEY=your_key_here
GROK_BASE_URL=https://api.x.ai/v1
GROK_MODEL=grok-2-latest
```

Get a key at [console.x.ai](https://console.x.ai/).

For a **free-tier** OpenAI-compatible API (Groq), use:

```env
GROK_API_KEY=your_groq_key
GROK_BASE_URL=https://api.groq.com/openai/v1
GROK_MODEL=llama-3.3-70b-versatile
```
