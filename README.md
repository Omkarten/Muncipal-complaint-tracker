# 🏛️ Municipal Complaint Tracker with SLA Escalation

A full-stack civic complaint management system that digitizes how municipal complaints are filed, tracked, and resolved — with **automatic SLA (Service Level Agreement) escalation** powered by database triggers and stored procedures.

> For the detailed implementation plan, see [plan.md](plan.md).

## 📌 Problem Statement

In most cities today, civic complaints (potholes, broken streetlights, water supply issues) are reported via phone calls or paper forms, entered into a register, and then often forgotten. There is no system tracking:

- **How long** a complaint has been open
- **Who** is responsible for resolving it
- **Whether** it breached any promised resolution time

This project solves that by building a digital complaint tracker where the **database itself enforces accountability** through automatic SLA breach detection and escalation — no human intervention required.

## ✨ Key Features

- **Citizen Complaint Filing** — Citizens can register and file complaints under categories like Pothole, Streetlight, Water Supply, Sanitation, etc.
- **Automatic Department Routing** — Complaints are routed to the correct department based on category.
- **Priority Levels** — Complaints are classified as Low, Medium, High, or Critical. Critical complaints get shorter SLA deadlines.
- **SLA Deadline Enforcement** — Each complaint category has a configurable resolution deadline (e.g., potholes → 7 days). Deadlines are automatically computed and stored via database triggers at filing time.
- **Automatic Escalation** — A scheduled procedure scans for overdue complaints and escalates them to the assigned officer's supervisor, logging every escalation and notifying the citizen.
- **Audit Trail** — Every status change (Open → InProgress → Resolved) is immutably logged in a `StatusHistory` table.
- **Citizen Notifications** — Citizens receive in-app notifications when their complaints are escalated or resolved.
- **Post-Resolution Feedback** — Citizens can rate resolved complaints (1–5) and leave comments for accountability tracking.
- **Ward-Based Analytics** — Complaints are tied to geographic wards, enabling hotspot analysis.
- **Department Performance Dashboard** — Views aggregate resolution times, escalation counts, and complaint volumes per department.
- **Role-Based Access Control** — Separate permissions for Citizens, Officers, and Admins enforced at the database level.
- **Recursive Chain of Command** — A self-referencing Officer table enables recursive queries to traverse the full supervisory hierarchy.

## 🏗️ Architecture

```
┌────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│     React 18 Frontend   │────────▶│      Flask Backend      │────────▶│      PostgreSQL 17      │
│  Vite · Lucide · Router │         │    Python 3 · REST API  │         │                         │
│  (Landing, Citizen,     │◀────────│    + APScheduler        │◀────────│  Triggers · Procedures  │
│   Officer & Admin)      │  JSON   │  (Runs SLA Job Hourly)  │ psycopg2│  Views · Roles · CTEs   │
└────────────────────────┘         └─────────────────────────┘         └─────────────────────────┘
```

## 🗃️ Database Schema

### Entity-Relationship Overview

```
Citizen (1) ────files────▶ (M) Complaint
Department (1) ───handles──▶ (M) Complaint
Department (1) ───employs──▶ (M) Officer
Officer (1) ───assigned to──▶ (M) Complaint
Officer (1) ───supervises──▶ (M) Officer       [self-referencing: supervisor_id]
Ward (1) ───locates──▶ (M) Complaint
Complaint (1) ───has────▶ (M) StatusHistory
Complaint (1) ───triggers──▶ (M) Escalation_Log
Complaint (1) ───notifies──▶ (M) Notification
Complaint (1) ───receives──▶ (0..1) Feedback
SLA_Rule (1) ───governs──▶ (M) Complaint       [via category]
```

### Tables

| Table | Purpose |
|---|---|
| **Citizen** | Stores citizen identity (name, phone, email, address) for complaint filing and notifications |
| **Department** | Municipal departments (Roads, Electricity, Water Supply, Sanitation, Public Health) for complaint routing |
| **Ward** | Geographic wards with zone classification — normalized from free-text location |
| **Officer** | Department employees with a self-referencing `supervisor_id` for escalation hierarchy |
| **SLA_Rule** | Maps complaint categories to departments and resolution deadlines (in hours) |
| **Complaint** | Central table — category, priority, description, ward, status, timestamps, and foreign keys |
| **StatusHistory** | Immutable audit trail logging every status transition with timestamps |
| **Escalation_Log** | Records every escalation event: from/to officer, reason, and timestamp |
| **Notification** | Citizen-facing alerts for escalations and resolutions, with read/unread tracking |
| **Feedback** | Post-resolution citizen rating (1–5) and comments — one per complaint |

## ⚙️ Core Database Logic

### Trigger 1 — Auto-Set Deadline on Filing

When a new complaint is inserted, a `BEFORE INSERT` trigger looks up the SLA rule for that category and computes `deadline_at = filed_at + resolution_hours`. Critical priority complaints get half the normal deadline. Falls back to a 72-hour default if no rule exists.

### Trigger 2 — Auto-Log Status Changes

An `AFTER UPDATE` trigger on the Complaint table detects status changes and inserts a row into `StatusHistory` automatically — ensuring a complete, tamper-proof audit trail.

### Stored Procedure — Escalate Overdue Complaints

`escalate_overdue_complaints()` scans all Open/InProgress complaints where `deadline_at < NOW()`, finds the assigned officer's supervisor, reassigns the complaint upward, marks it as `Escalated`, logs the event in `Escalation_Log`, and creates a `Notification` for the citizen. Wrapped in a transaction with BEGIN/COMMIT. Runs hourly via APScheduler.

### Recursive CTE — Chain of Command

A recursive query traverses the self-referencing Officer table to display the full supervisory hierarchy above any given officer — useful for multi-level escalation and org-chart visualization.

### Indexes & Performance

Strategic indexes on frequently queried columns (`status + deadline_at`, `citizen_id`, `ward_id`, `supervisor_id`) with `EXPLAIN ANALYZE` output documented in the report.

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Database** | PostgreSQL 15+ (v17) | Superior trigger/procedure support, native CHECK constraints, stored procedures |
| **Backend** | Python + Flask (REST API) | Lightweight, connects via `psycopg2` (raw SQL — no ORM hiding queries) |
| **Frontend** | React 18 + Vite | Modern single-page application with responsive civic design, Lucide icons, and role views |
| **Scheduler** | APScheduler (Python) | Runs `escalate_overdue_complaints()` automatically on schedule |
| **Alternative SSR UI** | Jinja2 + Bootstrap 5 | Classic server-rendered view accessible at `/classic` |
| **Version Control** | Git + GitHub | Collaboration and project history |

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL 15+ (or Docker)
- Node.js 18+ & npm (for frontend development)

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Municipal-complaint-tracker.git
   cd Municipal-complaint-tracker
   ```

2. **Set up PostgreSQL database**
   ```bash
   createdb municipal_complaints
   psql -d municipal_complaints -f sql/01_schema.sql
   psql -d municipal_complaints -f sql/02_triggers.sql
   psql -d municipal_complaints -f sql/03_procedures.sql
   psql -d municipal_complaints -f sql/04_views.sql
   psql -d municipal_complaints -f sql/05_roles.sql
   psql -d municipal_complaints -f sql/06_indexes.sql
   psql -d municipal_complaints -f sql/07_seed_data.sql
   ```

3. **Install Python dependencies & configure environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

4. **Build Frontend (Production SPA)**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

5. **Start the Application**
   ```bash
   python run.py
   ```
   * Open `http://localhost:5000` to view the full **React 18 Frontend** connected directly to the PostgreSQL backend!
   * (Optional) For live React hot-reloading development:
     ```bash
     cd frontend && npm run dev
     ```
     The Vite dev server runs on `http://localhost:3000` with an active proxy to the Flask backend.

## 📊 Sample Analytical Queries

**Officers with the most escalations (accountability report):**
```sql
SELECT o.name, COUNT(*) AS escalations
FROM Escalation_Log e JOIN Officer o ON e.from_officer = o.officer_id
GROUP BY o.name ORDER BY escalations DESC LIMIT 5;
```

**Average resolution time by complaint category:**
```sql
SELECT category, ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - filed_at))/3600), 1) AS avg_hours
FROM Complaint WHERE status = 'Resolved' GROUP BY category;
```

**Complaints per ward (geographic hotspot analysis):**
```sql
SELECT w.ward_name, w.zone, COUNT(*) AS total,
       COUNT(*) FILTER (WHERE c.status = 'Escalated') AS escalated
FROM Complaint c JOIN Ward w ON c.ward_id = w.ward_id
GROUP BY w.ward_name, w.zone ORDER BY total DESC;
```

**Average citizen satisfaction per department:**
```sql
SELECT d.dept_name, ROUND(AVG(f.rating), 1) AS avg_rating, COUNT(*) AS reviews
FROM Feedback f
JOIN Complaint c ON f.complaint_id = c.complaint_id
JOIN Department d ON c.dept_id = d.dept_id
GROUP BY d.dept_name ORDER BY avg_rating;
```

## 📁 Project Structure

```
Municipal-complaint-tracker/
├── README.md                  # Project documentation
├── blueprint.md               # Original project blueprint and design rationale
├── plan.md                    # Implementation plan with improvements
├── .env.example               # Environment variable template
├── requirements.txt           # Python dependencies
├── run.py                     # Application entry point
├── sql/
│   ├── 01_schema.sql          # Tables in dependency order
│   ├── 02_triggers.sql        # Trigger functions
│   ├── 03_procedures.sql      # Escalation stored procedure
│   ├── 04_views.sql           # Dashboard views
│   ├── 05_roles.sql           # GRANT/REVOKE permissions
│   ├── 06_indexes.sql         # Performance indexes
│   ├── 07_seed_data.sql       # Realistic sample data
│   └── 08_queries.sql         # Analytical queries for report
├── app/
│   ├── __init__.py            # Flask app factory
│   ├── config.py              # DB config from .env
│   ├── db.py                  # psycopg2 connection helper
│   ├── routes/
│   │   ├── auth.py            # Login/logout, session-based role check
│   │   ├── citizen.py         # File complaint, track status, notifications, feedback
│   │   ├── officer.py         # View assigned, update status
│   │   └── admin.py           # Dashboard, manual escalation, system overview
│   └── templates/
│       ├── base.html          # Bootstrap 5 layout
│       ├── login.html
│       ├── citizen/
│       ├── officer/
│       └── admin/
├── static/                    # CSS, JS, images
└── scheduler.py               # APScheduler → calls escalation procedure hourly
```

## 🎯 DBMS Concepts Demonstrated

| Concept | Where It Appears |
|---|---|
| **Normalization (3NF)** | Schema design — separate tables for Citizen, Department, Officer, Ward, SLA_Rule |
| **Triggers** | `trg_set_deadline` (BEFORE INSERT), `trg_log_status` (AFTER UPDATE) |
| **Stored Procedures** | `escalate_overdue_complaints()` |
| **Transactions** | Explicit BEGIN/COMMIT in escalation procedure and officer actions |
| **Views** | `dept_performance`, `overdue_complaints`, `ward_summary`, `officer_workload` |
| **Recursive CTE** | Chain-of-command query on self-referencing Officer table |
| **Indexes** | Strategic indexes with EXPLAIN ANALYZE documentation |
| **GRANT / REVOKE** | Role-based access for citizen, officer, and admin roles |
| **CHECK Constraints** | Status and priority fields restricted to valid values |
| **Audit Trail** | StatusHistory table — append-only log of all transitions |
| **Denormalization Trade-off** | `deadline_at` stored at insert time for trigger performance |

## 📄 License

This project is built for educational purposes as a DBMS mini-project.

---

> **Built with PostgreSQL, Python, and a passion for civic accountability.**
