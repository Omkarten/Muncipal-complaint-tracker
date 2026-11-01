-- ==============================================================================
-- 04_views.sql: Analytical Views for Dashboards & Performance Tracking
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- View 1: Department Performance Dashboard
-- Aggregates overall performance, average resolution time, and escalations
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW dept_performance AS
SELECT
    d.dept_id,
    d.dept_name,
    COUNT(c.complaint_id) AS total_complaints,
    COUNT(*) FILTER (WHERE c.status = 'Resolved') AS resolved_count,
    COUNT(*) FILTER (WHERE c.status = 'Escalated') AS escalated_count,
    COUNT(*) FILTER (WHERE c.status IN ('Open', 'InProgress')) AS pending_count,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.filed_at)) / 3600.0)
        FILTER (WHERE c.status = 'Resolved' AND c.resolved_at IS NOT NULL),
        2
    ) AS avg_resolution_hours,
    ROUND(
        (COUNT(*) FILTER (WHERE c.status = 'Resolved')::NUMERIC /
         NULLIF(COUNT(c.complaint_id), 0)) * 100,
        1
    ) AS resolution_percentage
FROM Department d
LEFT JOIN Complaint c ON d.dept_id = c.dept_id
GROUP BY d.dept_id, d.dept_name;

-- ------------------------------------------------------------------------------
-- View 2: Overdue Complaints
-- Real-time list of all complaints that have breached SLA and need attention
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW overdue_complaints AS
SELECT
    c.complaint_id,
    c.category,
    c.priority,
    d.dept_name,
    w.ward_name,
    w.zone,
    o.name AS assigned_officer_name,
    c.filed_at,
    c.deadline_at,
    ROUND(EXTRACT(EPOCH FROM (NOW() - c.deadline_at)) / 3600.0, 1) AS hours_overdue,
    c.status
FROM Complaint c
LEFT JOIN Department d ON c.dept_id = d.dept_id
LEFT JOIN Ward w ON c.ward_id = w.ward_id
LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
WHERE c.status IN ('Open', 'InProgress')
  AND c.deadline_at < NOW()
ORDER BY hours_overdue DESC;

-- ------------------------------------------------------------------------------
-- View 3: Ward Summary (Geographic Hotspots)
-- Identifies problem areas across city wards and zones
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW ward_summary AS
SELECT
    w.ward_id,
    w.ward_name,
    w.zone,
    COUNT(c.complaint_id) AS total_complaints,
    COUNT(*) FILTER (WHERE c.status = 'Resolved') AS resolved_count,
    COUNT(*) FILTER (WHERE c.status = 'Escalated') AS escalated_count,
    COUNT(*) FILTER (WHERE c.status IN ('Open', 'InProgress')) AS open_count,
    ROUND(
        (COUNT(*) FILTER (WHERE c.status = 'Resolved')::NUMERIC /
         NULLIF(COUNT(c.complaint_id), 0)) * 100,
        1
    ) AS resolution_rate_pct
FROM Ward w
LEFT JOIN Complaint c ON w.ward_id = c.ward_id
GROUP BY w.ward_id, w.ward_name, w.zone;

-- ------------------------------------------------------------------------------
-- View 4: Officer Workload
-- Displays current pending assignment distribution across municipal officers
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW officer_workload AS
SELECT
    o.officer_id,
    o.name AS officer_name,
    o.designation,
    d.dept_name,
    COUNT(c.complaint_id) FILTER (WHERE c.status IN ('Open', 'InProgress', 'Escalated')) AS active_complaints,
    COUNT(c.complaint_id) FILTER (WHERE c.status = 'Escalated') AS escalated_complaints,
    COUNT(c.complaint_id) FILTER (WHERE c.status = 'Resolved') AS resolved_complaints
FROM Officer o
LEFT JOIN Department d ON o.dept_id = d.dept_id
LEFT JOIN Complaint c ON o.officer_id = c.assigned_officer
GROUP BY o.officer_id, o.name, o.designation, d.dept_name;
