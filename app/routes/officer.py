from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.db import query_db

bp = Blueprint('officer', __name__)

def require_officer():
    if session.get('role') != 'officer' or 'user_id' not in session:
        flash("Please log in as an officer.", "warning")
        return redirect(url_for('auth.login'))
    return None

@bp.route('/dashboard')
def dashboard():
    auth_check = require_officer()
    if auth_check:
        return auth_check

    officer_id = session['user_id']

    # Officer profile & supervisor
    officer = query_db("""
        SELECT o.*, d.dept_name, s.name AS supervisor_name, s.designation AS supervisor_designation
        FROM Officer o
        JOIN Department d ON o.dept_id = d.dept_id
        LEFT JOIN Officer s ON o.supervisor_id = s.officer_id
        WHERE o.officer_id = %s
    """, (officer_id,), one=True)

    # Active complaints assigned to this officer
    complaints = query_db("""
        SELECT c.*, ci.name AS citizen_name, ci.phone AS citizen_phone,
               w.ward_name, w.zone,
               ROUND(EXTRACT(EPOCH FROM (c.deadline_at - NOW())) / 3600.0, 1) AS hours_remaining
        FROM Complaint c
        JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        WHERE c.assigned_officer = %s
        ORDER BY
            CASE
                WHEN c.status = 'Escalated' THEN 1
                WHEN c.status = 'InProgress' THEN 2
                WHEN c.status = 'Open' THEN 3
                ELSE 4
            END,
            c.deadline_at ASC
    """, (officer_id,))

    # Workload summary
    counts = query_db("""
        SELECT
            COUNT(*) FILTER (WHERE status = 'Open') AS open_count,
            COUNT(*) FILTER (WHERE status = 'InProgress') AS in_progress_count,
            COUNT(*) FILTER (WHERE status = 'Escalated') AS escalated_count,
            COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved_count
        FROM Complaint
        WHERE assigned_officer = %s
    """, (officer_id,), one=True)

    # Recursive CTE: Officer's Reporting Chain
    chain = query_db("""
        WITH RECURSIVE OfficerHierarchy AS (
            SELECT officer_id, name, designation, supervisor_id, 1 AS level
            FROM Officer
            WHERE officer_id = %s
            UNION ALL
            SELECT o.officer_id, o.name, o.designation, o.supervisor_id, oh.level + 1
            FROM Officer o
            JOIN OfficerHierarchy oh ON o.officer_id = oh.supervisor_id
        )
        SELECT * FROM OfficerHierarchy ORDER BY level ASC
    """, (officer_id,))

    return render_template(
        'officer/dashboard.html',
        officer=officer,
        complaints=complaints,
        counts=counts,
        chain=chain
    )

@bp.route('/update-status/<int:complaint_id>', methods=['POST'])
def update_status(complaint_id):
    auth_check = require_officer()
    if auth_check:
        return auth_check

    officer_id = session['user_id']
    new_status = request.form.get('status')

    valid_statuses = ['Open', 'InProgress', 'Resolved', 'Closed']
    if new_status not in valid_statuses:
        flash("Invalid status selected.", "danger")
        return redirect(url_for('officer.dashboard'))

    # Update Complaint - triggers will automatically log StatusHistory and set resolved_at if Resolved!
    updated = query_db("""
        UPDATE Complaint
        SET status = %s
        WHERE complaint_id = %s AND assigned_officer = %s
    """, (new_status, complaint_id, officer_id), commit=True)

    if updated:
        flash(f"Complaint #{complaint_id} status updated to {new_status}.", "success")
    else:
        flash("Could not update complaint. Please verify assignment.", "danger")

    return redirect(url_for('officer.dashboard'))
