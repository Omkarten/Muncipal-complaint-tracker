-- ==============================================================================
-- 02_triggers.sql: Database Triggers for SLA Deadlines & Audit Trail
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Trigger 1: Auto-set deadline and filed_at on complaint submission
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_deadline()
RETURNS TRIGGER AS $$
DECLARE
    base_hrs INT;
    effective_hrs INT;
BEGIN
    -- Ensure filed_at is populated
    IF NEW.filed_at IS NULL THEN
        NEW.filed_at := NOW();
    END IF;

    -- Lookup base SLA hours for the category and department
    SELECT resolution_hours INTO base_hrs
    FROM SLA_Rule
    WHERE category = NEW.category AND dept_id = NEW.dept_id;

    -- Default fallback if category/dept rule is not defined
    IF base_hrs IS NULL THEN
        base_hrs := 72; -- 3 days default
    END IF;

    -- Adjust deadline based on priority
    IF NEW.priority = 'Critical' THEN
        effective_hrs := GREATEST(1, ROUND(base_hrs * 0.50)::INT);
    ELSIF NEW.priority = 'High' THEN
        effective_hrs := GREATEST(1, ROUND(base_hrs * 0.75)::INT);
    ELSIF NEW.priority = 'Low' THEN
        effective_hrs := ROUND(base_hrs * 1.25)::INT;
    ELSE -- 'Medium'
        effective_hrs := base_hrs;
    END IF;

    NEW.deadline_at := NEW.filed_at + (effective_hrs || ' hours')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_deadline ON Complaint;
CREATE TRIGGER trg_set_deadline
BEFORE INSERT ON Complaint
FOR EACH ROW
EXECUTE FUNCTION set_deadline();

-- ------------------------------------------------------------------------------
-- Trigger 2: Auto-populate resolved_at on Complaint when status becomes 'Resolved'
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_status_prereq()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Resolved' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
        IF NEW.resolved_at IS NULL THEN
            NEW.resolved_at := NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_handle_status_prereq ON Complaint;
CREATE TRIGGER trg_handle_status_prereq
BEFORE UPDATE ON Complaint
FOR EACH ROW
EXECUTE FUNCTION handle_status_prereq();

-- ------------------------------------------------------------------------------
-- Trigger 3: Immutable audit trail logging into StatusHistory & Notifications
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Insert into audit trail
        INSERT INTO StatusHistory(complaint_id, old_status, new_status, changed_at, changed_by)
        VALUES (NEW.complaint_id, OLD.status, NEW.status, NOW(), NEW.assigned_officer);

        -- Send citizen notification when resolved or closed
        IF NEW.status = 'Resolved' THEN
            INSERT INTO Notification(citizen_id, complaint_id, message, sent_at)
            VALUES (
                NEW.citizen_id,
                NEW.complaint_id,
                'Your complaint #' || NEW.complaint_id || ' (' || NEW.category || ') has been resolved. Please provide feedback.',
                NOW()
            );
        ELSIF NEW.status = 'Closed' THEN
            INSERT INTO Notification(citizen_id, complaint_id, message, sent_at)
            VALUES (
                NEW.citizen_id,
                NEW.complaint_id,
                'Your complaint #' || NEW.complaint_id || ' (' || NEW.category || ') has been closed.',
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_status ON Complaint;
CREATE TRIGGER trg_log_status
AFTER UPDATE ON Complaint
FOR EACH ROW
EXECUTE FUNCTION log_status_change();
