-- ============================================================
-- DevOps Task Manager - Database Initialization
-- ============================================================

-- Create schemas
CREATE SCHEMA IF NOT EXISTS tasks_db;
CREATE SCHEMA IF NOT EXISTS users_db;

-- ============================================================
-- USERS SCHEMA
-- ============================================================
CREATE TYPE users_db.user_role AS ENUM ('INTERN', 'DEVELOPER', 'MANAGER', 'LEAD');

CREATE TABLE IF NOT EXISTS users_db.users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(100) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    role        users_db.user_role NOT NULL DEFAULT 'DEVELOPER',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users_db.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users_db.users(email);

-- ============================================================
-- TASKS SCHEMA
-- ============================================================
CREATE TYPE tasks_db.task_status   AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE tasks_db.task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE IF NOT EXISTS tasks_db.tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      tasks_db.task_status   NOT NULL DEFAULT 'TODO',
    priority    tasks_db.task_priority NOT NULL DEFAULT 'MEDIUM',
    assigned_to VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks_db.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks_db.tasks(priority);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION tasks_db.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks_db.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks_db.tasks
    FOR EACH ROW
    EXECUTE FUNCTION tasks_db.update_updated_at_column();
