from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="User Service",
    description="DevOps Task Manager — User microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "user-service"}


@app.get("/")
def root():
    return {"message": "User Service is running", "docs": "/docs"}
