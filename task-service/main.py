from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers.tasks import router as tasks_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Service",
    description="DevOps Task Manager — Task microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "task-service"}


@app.get("/")
def root():
    return {"message": "Task Service is running", "docs": "/docs"}
