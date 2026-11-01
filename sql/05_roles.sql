-- ==============================================================================
-- 05_roles.sql: Role-Based Access Control (RBAC) via PostgreSQL Roles
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'citizen_role') THEN
        CREATE ROLE citizen_role;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'officer_role') THEN
        CREATE ROLE officer_role;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
END $$;

-- Citizen Role Permissions
GRANT USAGE ON SCHEMA public TO citizen_role;
GRANT SELECT, INSERT ON Complaint TO citizen_role;
GRANT SELECT, UPDATE (is_read) ON Notification TO citizen_role;
GRANT SELECT, INSERT ON Feedback TO citizen_role;
GRANT SELECT ON Ward, Department, SLA_Rule TO citizen_role;
GRANT SELECT ON StatusHistory TO citizen_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO citizen_role;

-- Officer Role Permissions
GRANT USAGE ON SCHEMA public TO officer_role;
GRANT SELECT, UPDATE ON Complaint TO officer_role;
GRANT SELECT, INSERT ON StatusHistory TO officer_role;
GRANT SELECT, INSERT ON Escalation_Log TO officer_role;
GRANT SELECT ON Citizen, Ward, Department, Officer, SLA_Rule, Feedback TO officer_role;
GRANT SELECT ON dept_performance, overdue_complaints, ward_summary, officer_workload TO officer_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO officer_role;

-- Admin Role Permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;
