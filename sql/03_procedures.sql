-- ==============================================================================
-- 03_procedures.sql: Stored Procedures & Transaction Logic for Escalation
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Stored Procedure: Escalate overdue complaints
-- Scans open complaints whose deadline has passed, promotes to supervisor,
-- logs to Escalation_Log, and notifies the citizen.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE escalate_overdue_complaints()
LANGUAGE plpgsql AS $$
DECLARE
    rec RECORD;
    v_supervisor_id INT;
BEGIN
    FOR rec IN
        SELECT c.complaint_id, c.citizen_id, c.category, c.assigned_officer
        FROM Complaint c
        WHERE c.status IN ('Open', 'InProgress')
          AND c.deadline_at < NOW()
        ORDER BY c.deadline_at ASC
    LOOP
        -- Find the supervisor of the currently assigned officer
        SELECT supervisor_id INTO v_supervisor_id
        FROM Officer
        WHERE officer_id = rec.assigned_officer;

        IF v_supervisor_id IS NOT NULL THEN
            -- Reassign to supervisor and mark as Escalated
            UPDATE Complaint
            SET status = 'Escalated',
                assigned_officer = v_supervisor_id
            WHERE complaint_id = rec.complaint_id;

            -- Audit log of escalation
            INSERT INTO Escalation_Log(complaint_id, from_officer, to_officer, reason, escalated_at)
            VALUES (rec.complaint_id, rec.assigned_officer, v_supervisor_id, 'SLA deadline breached', NOW());

            -- Citizen notification
            INSERT INTO Notification(citizen_id, complaint_id, message, sent_at)
            VALUES (
                rec.citizen_id,
                rec.complaint_id,
                'Your complaint #' || rec.complaint_id || ' (' || rec.category || ') has breached its SLA resolution deadline and has been escalated to higher authority.',
                NOW()
            );
        ELSE
            -- Officer has no supervisor (Department Head). Keep assigned, flag as Escalated
            UPDATE Complaint
            SET status = 'Escalated'
            WHERE complaint_id = rec.complaint_id;

            INSERT INTO Escalation_Log(complaint_id, from_officer, to_officer, reason, escalated_at)
            VALUES (rec.complaint_id, rec.assigned_officer, rec.assigned_officer, 'SLA breached - already assigned to Dept Head', NOW());

            INSERT INTO Notification(citizen_id, complaint_id, message, sent_at)
            VALUES (
                rec.citizen_id,
                rec.complaint_id,
                'Your complaint #' || rec.complaint_id || ' (' || rec.category || ') is currently escalated at executive level for urgent action.',
                NOW()
            );
        END IF;
    END LOOP;
END;
$$;

-- ------------------------------------------------------------------------------
-- Transaction Demo Procedure: Resolve complaint atomically
-- Demonstrates BEGIN, COMMIT, and exception ROLLBACK in PL/pgSQL
-- ------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE resolve_complaint_txn(
    p_complaint_id INT,
    p_officer_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Verify the complaint exists and is not already closed
    IF NOT EXISTS (SELECT 1 FROM Complaint WHERE complaint_id = p_complaint_id AND status != 'Closed') THEN
        RAISE EXCEPTION 'Complaint % does not exist or is already closed', p_complaint_id;
    END IF;

    -- Update complaint status atomically
    UPDATE Complaint
    SET status = 'Resolved',
        resolved_at = NOW(),
        assigned_officer = p_officer_id
    WHERE complaint_id = p_complaint_id;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;
