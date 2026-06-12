import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://taskadmin:taskpassword@localhost:5432/taskmanager")
SCHEMA = os.getenv("POSTGRES_SCHEMA", "users_db")

engine = create_engine(
    DATABASE_URL,
    connect_args={},
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        db.execute(text(f"SET search_path TO {SCHEMA}"))
        yield db
    finally:
        db.close()
