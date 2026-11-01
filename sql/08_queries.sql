-- ==============================================================================
-- 08_queries.sql: 15 Core Analytical Queries for Project Report & Evaluation
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Query 1: Officers with the most escalations against them (Accountability Report)
-- ------------------------------------------------------------------------------
SELECT
    o.officer_id,
    o.name AS officer_name,
    d.dept_name,
    COUNT(e.escalation_id) AS total_escalations
FROM Officer o
JOIN Department d ON o.dept_id = d.dept_id
JOIN Escalation_Log e ON o.officer_id = e.from_officer
GROUP BY o.officer_id, o.name, d.dept_name
ORDER BY total_escalations DESC
LIMIT 5;

-- ------------------------------------------------------------------------------
-- Query 2: Average resolution time (hours) by complaint category
-- ------------------------------------------------------------------------------
SELECT
    category,
    COUNT(*) AS resolved_complaints,
    ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - filed_at)) / 3600.0), 1) AS avg_resolution_hours,
    ROUND(MIN(EXTRACT(EPOCH FROM (resolved_at - filed_at)) / 3600.0), 1) AS min_resolution_hours,
    ROUND(MAX(EXTRACT(EPOCH FROM (resolved_at - filed_at)) / 3600.0), 1) AS max_resolution_hours
FROM Complaint
WHERE status = 'Resolved' AND resolved_at IS NOT NULL
GROUP BY category
ORDER BY avg_resolution_hours DESC;

-- ------------------------------------------------------------------------------
-- Query 3: Most active complainants (Citizens filing repeated issues / hotspots)
-- ------------------------------------------------------------------------------
SELECT
    c.citizen_id,
    c.name AS citizen_name,
    c.phone,
    COUNT(co.complaint_id) AS total_complaints,
    COUNT(*) FILTER (WHERE co.status = 'Resolved') AS resolved,
    COUNT(*) FILTER (WHERE co.status = 'Escalated') AS escalated
FROM Citizen c
JOIN Complaint co ON c.citizen_id = co.citizen_id
GROUP BY c.citizen_id, c.name, c.phone
ORDER BY total_complaints DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- Query 4: Complaints per ward & zone (Geographic Distribution)
-- ------------------------------------------------------------------------------
SELECT
    w.zone,
    w.ward_name,
    COUNT(c.complaint_id) AS total_complaints,
    COUNT(*) FILTER (WHERE c.status = 'Escalated') AS escalated_count,
    COUNT(*) FILTER (WHERE c.status = 'Resolved') AS resolved_count
FROM Ward w
LEFT JOIN Complaint c ON w.ward_id = c.ward_id
GROUP BY w.zone, w.ward_name
ORDER BY w.zone, total_complaints DESC;

-- ------------------------------------------------------------------------------
-- Query 5: Department performance comparison with SLA metrics
-- ------------------------------------------------------------------------------
SELECT
    dept_name,
    total_complaints,
    resolved_count,
    escalated_count,
    pending_count,
    avg_resolution_hours,
    resolution_percentage
FROM dept_performance
ORDER BY resolution_percentage DESC;

-- ------------------------------------------------------------------------------
-- Query 6: Complete escalation chain for a complaint
-- ------------------------------------------------------------------------------
SELECT
    e.complaint_id,
    c.category,
    o1.name AS from_officer_name,
    o1.designation AS from_designation,
    o2.name AS escalated_to_officer,
    o2.designation AS to_designation,
    e.reason,
    e.escalated_at
FROM Escalation_Log e
JOIN Complaint c ON e.complaint_id = c.complaint_id
JOIN Officer o1 ON e.from_officer = o1.officer_id
JOIN Officer o2 ON e.to_officer = o2.officer_id
ORDER BY e.escalated_at ASC;

-- ------------------------------------------------------------------------------
-- Query 7: Recursive CTE - Hierarchical Chain of Command from Field Officer up to Head
-- (e.g. For Officer ID = 11: Amit Sharma -> Vikram Malhotra -> Dr. Ramesh Rao)
-- ------------------------------------------------------------------------------
WITH RECURSIVE OfficerHierarchy AS (
    -- Anchor member: starting officer
    SELECT
        officer_id,
        name,
        designation,
        supervisor_id,
        dept_id,
        1 AS hierarchy_level
    FROM Officer
    WHERE officer_id = 11

    UNION ALL

    -- Recursive member: follow supervisor_id upward
    SELECT
        o.officer_id,
        o.name,
        o.designation,
        o.supervisor_id,
        o.dept_id,
        oh.hierarchy_level + 1
    FROM Officer o
    JOIN OfficerHierarchy oh ON o.officer_id = oh.supervisor_id
)
SELECT
    hierarchy_level,
    officer_id,
    name AS officer_name,
    designation,
    supervisor_id
FROM OfficerHierarchy
ORDER BY hierarchy_level ASC;

-- ------------------------------------------------------------------------------
-- Query 8: Average citizen satisfaction rating per department (Feedback)
-- ------------------------------------------------------------------------------
SELECT
    d.dept_name,
    COUNT(f.feedback_id) AS total_reviews,
    ROUND(AVG(f.rating), 2) AS avg_satisfaction_rating,
    COUNT(*) FILTER (WHERE f.rating >= 4) AS positive_reviews,
    COUNT(*) FILTER (WHERE f.rating <= 2) AS critical_reviews
FROM Department d
JOIN Complaint c ON d.dept_id = c.dept_id
JOIN Feedback f ON c.complaint_id = f.complaint_id
GROUP BY d.dept_name
ORDER BY avg_satisfaction_rating DESC;

-- ------------------------------------------------------------------------------
-- Query 9: Trend Analysis - Complaints filed per day/interval
-- ------------------------------------------------------------------------------
SELECT
    DATE_TRUNC('day', filed_at)::DATE AS filing_date,
    COUNT(*) AS complaints_filed,
    COUNT(*) FILTER (WHERE priority = 'Critical') AS critical_priority_count
FROM Complaint
GROUP BY DATE_TRUNC('day', filed_at)
ORDER BY filing_date DESC;

-- ------------------------------------------------------------------------------
-- Query 10: SLA Breach Rate by Category
-- ------------------------------------------------------------------------------
SELECT
    c.category,
    COUNT(c.complaint_id) AS total_complaints,
    COUNT(*) FILTER (WHERE c.status = 'Escalated' OR (c.status IN ('Open', 'InProgress') AND c.deadline_at < NOW())) AS breached_count,
    ROUND(
        (COUNT(*) FILTER (WHERE c.status = 'Escalated' OR (c.status IN ('Open', 'InProgress') AND c.deadline_at < NOW()))::NUMERIC /
        NULLIF(COUNT(c.complaint_id), 0)) * 100,
        1
    ) AS breach_rate_pct
FROM Complaint c
GROUP BY c.category
ORDER BY breach_rate_pct DESC;

-- ------------------------------------------------------------------------------
-- Query 11: Unread Notifications per Citizen
-- ------------------------------------------------------------------------------
SELECT
    ci.citizen_id,
    ci.name,
    ci.phone,
    COUNT(n.notification_id) AS unread_notifications
FROM Citizen ci
JOIN Notification n ON ci.citizen_id = n.citizen_id
WHERE n.is_read = FALSE
GROUP BY ci.citizen_id, ci.name, ci.phone
ORDER BY unread_notifications DESC;

-- ------------------------------------------------------------------------------
-- Query 12: Officer Workload Distribution
-- ------------------------------------------------------------------------------
SELECT
    officer_name,
    dept_name,
    designation,
    active_complaints,
    escalated_complaints,
    resolved_complaints
FROM officer_workload
ORDER BY active_complaints DESC;

-- ------------------------------------------------------------------------------
-- Query 13: Priority distribution across departments
-- ------------------------------------------------------------------------------
SELECT
    d.dept_name,
    COUNT(*) FILTER (WHERE c.priority = 'Critical') AS critical_count,
    COUNT(*) FILTER (WHERE c.priority = 'High') AS high_count,
    COUNT(*) FILTER (WHERE c.priority = 'Medium') AS medium_count,
    COUNT(*) FILTER (WHERE c.priority = 'Low') AS low_count,
    COUNT(c.complaint_id) AS total
FROM Department d
LEFT JOIN Complaint c ON d.dept_id = c.dept_id
GROUP BY d.dept_name
ORDER BY critical_count DESC;

-- ------------------------------------------------------------------------------
-- Query 14: Audit Trail History for a Specific Complaint
-- ------------------------------------------------------------------------------
SELECT
    sh.history_id,
    sh.complaint_id,
    sh.old_status,
    sh.new_status,
    sh.changed_at,
    o.name AS changed_by_officer
FROM StatusHistory sh
LEFT JOIN Officer o ON sh.changed_by = o.officer_id
ORDER BY sh.changed_at DESC;

-- ------------------------------------------------------------------------------
-- Query 15: Wards with Lowest Resolution Rates (Critical Focus Areas)
-- ------------------------------------------------------------------------------
SELECT
    ward_name,
    zone,
    total_complaints,
    resolved_count,
    resolution_rate_pct
FROM ward_summary
WHERE total_complaints > 0
ORDER BY resolution_rate_pct ASC
LIMIT 5;
