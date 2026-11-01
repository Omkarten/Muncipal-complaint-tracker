-- ==============================================================================
-- 01_schema.sql: Core Relational Schema for Municipal Complaint Tracker
-- ==============================================================================

DROP TABLE IF EXISTS Feedback CASCADE;
DROP TABLE IF EXISTS Notification CASCADE;
DROP TABLE IF EXISTS Escalation_Log CASCADE;
DROP TABLE IF EXISTS StatusHistory CASCADE;
DROP TABLE IF EXISTS Complaint CASCADE;
DROP TABLE IF EXISTS SLA_Rule CASCADE;
DROP TABLE IF EXISTS Officer CASCADE;
DROP TABLE IF EXISTS Ward CASCADE;
DROP TABLE IF EXISTS Department CASCADE;
DROP TABLE IF EXISTS Citizen CASCADE;

-- 1. Citizen table
CREATE TABLE Citizen (
    citizen_id      SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(15) UNIQUE NOT NULL,
    email           VARCHAR(100),
    address         TEXT
);

-- 2. Department table
CREATE TABLE Department (
    dept_id         SERIAL PRIMARY KEY,
    dept_name       VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Ward table (geographic normalization)
CREATE TABLE Ward (
    ward_id         SERIAL PRIMARY KEY,
    ward_name       VARCHAR(50) NOT NULL,
    zone            VARCHAR(50) CHECK (zone IN ('North', 'South', 'East', 'West', 'Central'))
);

-- 4. Officer table with self-referencing supervisor
CREATE TABLE Officer (
    officer_id      SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    dept_id         INT REFERENCES Department(dept_id),
    designation     VARCHAR(50),           -- 'Field Officer', 'Supervisor', 'Head'
    supervisor_id   INT REFERENCES Officer(officer_id),  -- Self-referencing FK
    email           VARCHAR(100)
);

-- 5. SLA_Rule table
CREATE TABLE SLA_Rule (
    sla_id           SERIAL PRIMARY KEY,
    category         VARCHAR(50) NOT NULL,
    dept_id          INT REFERENCES Department(dept_id),
    resolution_hours INT NOT NULL,          -- e.g. 72, 168
    UNIQUE(category, dept_id)
);

-- 6. Complaint table
CREATE TABLE Complaint (
    complaint_id     SERIAL PRIMARY KEY,
    citizen_id       INT REFERENCES Citizen(citizen_id),
    category         VARCHAR(50) NOT NULL,
    priority         VARCHAR(10) DEFAULT 'Medium'
                     CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    description      TEXT,
    ward_id          INT REFERENCES Ward(ward_id),
    location_details VARCHAR(200),
    dept_id          INT REFERENCES Department(dept_id),
    assigned_officer INT REFERENCES Officer(officer_id),
    status           VARCHAR(20) DEFAULT 'Open'
                     CHECK (status IN ('Open', 'InProgress', 'Resolved', 'Escalated', 'Closed')),
    filed_at         TIMESTAMP DEFAULT NOW(),
    deadline_at      TIMESTAMP,              -- Populated automatically via trigger
    resolved_at      TIMESTAMP
);

-- 7. StatusHistory table (immutable audit trail)
CREATE TABLE StatusHistory (
    history_id      SERIAL PRIMARY KEY,
    complaint_id    INT REFERENCES Complaint(complaint_id) ON DELETE CASCADE,
    old_status      VARCHAR(20),
    new_status      VARCHAR(20),
    changed_at      TIMESTAMP DEFAULT NOW(),
    changed_by      INT REFERENCES Officer(officer_id)
);

-- 8. Escalation_Log table
CREATE TABLE Escalation_Log (
    escalation_id   SERIAL PRIMARY KEY,
    complaint_id    INT REFERENCES Complaint(complaint_id) ON DELETE CASCADE,
    from_officer    INT REFERENCES Officer(officer_id),
    to_officer      INT REFERENCES Officer(officer_id),
    reason          VARCHAR(100),
    escalated_at    TIMESTAMP DEFAULT NOW()
);

-- 9. Notification table (citizen alerts)
CREATE TABLE Notification (
    notification_id SERIAL PRIMARY KEY,
    citizen_id      INT REFERENCES Citizen(citizen_id) ON DELETE CASCADE,
    complaint_id    INT REFERENCES Complaint(complaint_id) ON DELETE CASCADE,
    message         TEXT NOT NULL,
    sent_at         TIMESTAMP DEFAULT NOW(),
    is_read         BOOLEAN DEFAULT FALSE
);

-- 10. Feedback table (post-resolution satisfaction rating)
CREATE TABLE Feedback (
    feedback_id     SERIAL PRIMARY KEY,
    complaint_id    INT UNIQUE REFERENCES Complaint(complaint_id) ON DELETE CASCADE,
    rating          INT CHECK (rating BETWEEN 1 AND 5),
    comments        TEXT,
    submitted_at    TIMESTAMP DEFAULT NOW()
);
