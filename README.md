# Taskr — FastAPI + React + Postgres

A full-stack task manager, Railway-ready.

## Project Structure

```
taskr/
├── main.py              ← FastAPI backend (serves API + React static files)
├── requirements.txt     ← Python dependencies
├── Procfile             ← Production start command (Gunicorn)
├── railway.toml         ← Railway build & deploy config
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js   ← Proxies /api to FastAPI in dev
    └── src/
        ├── main.jsx
        └── App.jsx
```

## Local Development

### 1. Start the backend
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs at: http://localhost:8000/docs

### 2. Start the frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
```
App at: http://localhost:5173 (Vite proxies `/api` → port 8000)

---

## Deploy to Railway

### Step 1 — Create a Railway account
Go to https://railway.app and sign up (free).

### Step 2 — Push your code to GitHub
```bash
git init
git add .
git commit -m "initial commit"
gh repo create taskr --public --push  # or push manually via GitHub
```

### Step 3 — Create a new Railway project
1. In Railway dashboard → **New Project** → **Deploy from GitHub repo**
2. Select your `taskr` repository
3. Railway will detect `railway.toml` and configure itself automatically

### Step 4 — Add a Postgres database
1. In your Railway project → **+ New** → **Database** → **Add PostgreSQL**
2. Railway auto-creates the `DATABASE_URL` environment variable and injects
   it into your service — no manual config needed

### Step 5 — Deploy
Click **Deploy** (or it deploys automatically on git push).

That's it. Railway will:
- Install Python dependencies
- Install Node dependencies and build React (`npm run build`)
- Start Gunicorn with 4 workers
- Serve the React app from FastAPI at your Railway URL

### Step 6 — Get your URL
Go to your service → **Settings** → **Networking** → **Generate Domain**

---

## Environment Variables

| Variable       | Description                          | Default              |
|----------------|--------------------------------------|----------------------|
| `DATABASE_URL` | Postgres connection string           | SQLite (local dev)   |
| `PORT`         | Port to bind (set by Railway)        | 8000                 |

Railway sets both automatically — you don't need to touch them.

---

## API Reference

| Method   | Path              | Description         |
|----------|-------------------|---------------------|
| GET      | `/api/health`     | Health check        |
| GET      | `/api/tasks`      | List all tasks      |
| POST     | `/api/tasks`      | Create a task       |
| PATCH    | `/api/tasks/:id`  | Toggle done/undone  |
| DELETE   | `/api/tasks/:id`  | Delete a task       |
| GET      | `/api/stats`      | Task statistics     |
