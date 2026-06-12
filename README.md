# DevOps Task Manager

A microservices task management application built for Kubernetes DevOps lab testing (liveness probes, HPA, rollback, chaos engineering).

## Architecture

| Service       | Tech              | Port | Description                     |
|---------------|-------------------|------|---------------------------------|
| frontend      | React + Tailwind  | 3000 | Kanban UI (served via Nginx)    |
| task-service  | FastAPI + Postgres | 8000 | Task CRUD + stats               |
| user-service  | FastAPI + Postgres | 8001 | User CRUD                       |
| postgres      | PostgreSQL 15     | 5432 | Shared DB, 2 schemas            |

## Quick Start

```bash
# 1. Copy the environment file
cp .env.example .env

# 2. Build and start all services
docker-compose up --build

# 3. Open the application
open http://localhost:3000
```

## API Docs (Swagger UI)

- Task Service: http://localhost:8000/docs
- User Service: http://localhost:8001/docs

## Health Check Endpoints

```
GET http://localhost:8000/health  → {"status":"healthy","service":"task-service"}
GET http://localhost:8001/health  → {"status":"healthy","service":"user-service"}
```

These endpoints are used by Kubernetes liveness probes.

## Seed Data

The database is pre-populated with:
- **5 users**: roles INTERN, DEVELOPER (×2), MANAGER, LEAD
- **10 tasks**: spread across TODO / IN_PROGRESS / DONE, various priorities

## Features

- **Kanban board** with drag-and-drop between TODO / IN PROGRESS / DONE
- **List view** with sortable table
- **Search & filters** by status, priority, assignee
- **User management** CRUD with role assignment
- **Dashboard** with live stats and progress bars
- **Toast notifications** for all CRUD operations

## Kubernetes Readiness

Each backend service exposes `/health` for liveness probes. Example probe config:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 30
readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Environment Variables

| Variable                    | Default          | Used by       |
|-----------------------------|------------------|---------------|
| POSTGRES_USER               | taskadmin        | postgres      |
| POSTGRES_PASSWORD           | taskpassword     | postgres      |
| POSTGRES_DB                 | taskmanager      | postgres      |
| DATABASE_URL                | auto-constructed | task/user svc |
| REACT_APP_TASK_SERVICE_URL  | http://localhost:8000 | frontend |
| REACT_APP_USER_SERVICE_URL  | http://localhost:8001 | frontend |
