import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")
ASSETS = os.path.join(DIST, "assets")
INDEX = os.path.join(DIST, "index.html")


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="Hello World", lifespan=lifespan)


@app.get("/api/hello")
def hello():
    return {"message": "Hello World"}


if os.path.isdir(ASSETS):
    app.mount("/assets", StaticFiles(directory=ASSETS), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str):
    if not os.path.exists(INDEX):
        return {"error": "frontend not built"}
    return FileResponse(INDEX)
