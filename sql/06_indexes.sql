-- ==============================================================================
-- 06_indexes.sql: Indexing Strategy for Performance & Query Optimization
-- ==============================================================================

-- 1. Composite index for overdue complaints scan (used by escalation procedure & views)
DROP INDEX IF EXISTS idx_complaint_status_deadline;
CREATE INDEX idx_complaint_status_deadline ON Complaint(status, deadline_at);

-- 2. Foreign key search indexes for Complaint joins
DROP INDEX IF EXISTS idx_complaint_citizen;
CREATE INDEX idx_complaint_citizen ON Complaint(citizen_id);

DROP INDEX IF EXISTS idx_complaint_dept;
CREATE INDEX idx_complaint_dept ON Complaint(dept_id);

DROP INDEX IF EXISTS idx_complaint_ward;
CREATE INDEX idx_complaint_ward ON Complaint(ward_id);

DROP INDEX IF EXISTS idx_complaint_officer;
CREATE INDEX idx_complaint_officer ON Complaint(assigned_officer);

-- 3. Self-referencing supervisor lookup index (used in escalation & recursive queries)
DROP INDEX IF EXISTS idx_officer_supervisor;
CREATE INDEX idx_officer_supervisor ON Officer(supervisor_id);

-- 4. Citizen notification retrieval index (quick lookup for unread notifications)
DROP INDEX IF EXISTS idx_notification_citizen_unread;
CREATE INDEX idx_notification_citizen_unread ON Notification(citizen_id, is_read);

-- 5. Audit log lookup indexes
DROP INDEX IF EXISTS idx_statushistory_complaint;
CREATE INDEX idx_statushistory_complaint ON StatusHistory(complaint_id);

DROP INDEX IF EXISTS idx_escalation_complaint;
CREATE INDEX idx_escalation_complaint ON Escalation_Log(complaint_id);

-- 6. Feedback lookup index
DROP INDEX IF EXISTS idx_feedback_complaint;
CREATE INDEX idx_feedback_complaint ON Feedback(complaint_id);
