import os
import uuid
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ─── Database ─────────────────────────────────────────────────────────────────

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./tasks.db")

# Railway provides "postgres://" but SQLAlchemy needs "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class TaskModel(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Startup / shutdown ───────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(TaskModel).count() == 0:
            db.add_all(
                [
                    TaskModel(title="Read the FastAPI docs", done=True),
                    TaskModel(title="Build something awesome", done=False),
                    TaskModel(title="Ship to production", done=False),
                ]
            )
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="Taskr API", version="1.0.0", lifespan=lifespan)


# ─── Schemas ──────────────────────────────────────────────────────────────────


class Task(BaseModel):
    id: str
    title: str
    done: bool
    created_at: str


class TaskCreate(BaseModel):
    title: str


def to_task(m: TaskModel) -> Task:
    return Task(
        id=m.id, title=m.title, done=m.done, created_at=m.created_at.isoformat()
    )


# ─── API routes (all prefixed /api) ──────────────────────────────────────────


@app.get("/api/health")
def health():
    return {"status": "ok", "dist_exists": os.path.exists(DIST), "dist_path": DIST}


@app.get("/api/tasks", response_model=List[Task])
def list_tasks(db: Session = Depends(get_db)):
    return [
        to_task(t) for t in db.query(TaskModel).order_by(TaskModel.created_at).all()
    ]


@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(body: TaskCreate, db: Session = Depends(get_db)):
    task = TaskModel(title=body.title.strip())
    db.add(task)
    db.commit()
    db.refresh(task)
    return to_task(task)


@app.patch("/api/tasks/{task_id}", response_model=Task)
def toggle_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    task.done = not task.done
    db.commit()
    db.refresh(task)
    return to_task(task)


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    db.delete(task)
    db.commit()


@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(TaskModel).count()
    done = db.query(TaskModel).filter(TaskModel.done == True).count()
    return {"total": total, "done": done, "pending": total - done}


@app.get("/api/dino")
def get_dino():
    return {
        "name": "Rexina",
        "species": "Tyrannosaurus Kawaii",
        "level": 99,
        "hp": 9999,
        "moves": ["Cute Roar", "Tail Swipe", "Sparkle Chomp", "Dino Beam"],
        "status": "ready to party 🦕",
    }


# ─── Serve React SPA (must come last) ────────────────────────────────────────

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")
ASSETS = os.path.join(DIST, "assets")
INDEX = os.path.join(DIST, "index.html")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str):
    if not os.path.exists(INDEX):
        return {
            "error": "frontend not built",
            "dist_path": DIST,
            "dist_exists": os.path.exists(DIST),
        }
    return FileResponse(INDEX)
