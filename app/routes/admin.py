from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.db import query_db, execute_proc

bp = Blueprint('admin', __name__)

def require_admin():
    if session.get('role') != 'admin':
        flash("Admin privileges required.", "danger")
        return redirect(url_for('auth.login'))
    return None

@bp.route('/dashboard')
def dashboard():
    auth_check = require_admin()
    if auth_check:
        return auth_check

    # Department performance from View 1
    departments = query_db("SELECT * FROM dept_performance ORDER BY resolution_percentage DESC")

    # Overdue complaints from View 2
    overdue = query_db("SELECT * FROM overdue_complaints LIMIT 10")

    # Ward summary from View 3
    wards = query_db("SELECT * FROM ward_summary ORDER BY resolution_rate_pct ASC")

    # Overall KPIs
    kpis = query_db("""
        SELECT
            COUNT(*) AS total_complaints,
            COUNT(*) FILTER (WHERE status = 'Resolved') AS total_resolved,
            COUNT(*) FILTER (WHERE status = 'Escalated') AS total_escalated,
            COUNT(*) FILTER (WHERE status IN ('Open', 'InProgress')) AS total_pending,
            ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - filed_at)) / 3600.0) FILTER (WHERE status = 'Resolved'), 1) AS overall_avg_hrs
        FROM Complaint
    """, one=True)

    # Average satisfaction
    rating_data = query_db("SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(*) AS count FROM Feedback", one=True)

    return render_template(
        'admin/dashboard.html',
        departments=departments,
        overdue=overdue,
        wards=wards,
        kpis=kpis,
        rating_data=rating_data
    )

@bp.route('/complaints')
def all_complaints():
    auth_check = require_admin()
    if auth_check:
        return auth_check

    status_filter = request.args.get('status', '')
    dept_filter = request.args.get('dept_id', '')

    query = """
        SELECT c.*, ci.name AS citizen_name, d.dept_name, w.ward_name, o.name AS officer_name
        FROM Complaint c
        JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        WHERE 1=1
    """
    params = []
    if status_filter:
        query += " AND c.status = %s"
        params.append(status_filter)
    if dept_filter:
        query += " AND c.dept_id = %s"
        params.append(dept_filter)

    query += " ORDER BY c.filed_at DESC LIMIT 50"
    complaints = query_db(query, params)
    departments = query_db("SELECT * FROM Department ORDER BY dept_name")

    return render_template(
        'admin/all_complaints.html',
        complaints=complaints,
        departments=departments,
        selected_status=status_filter,
        selected_dept=dept_filter
    )

@bp.route('/escalations')
def escalations():
    auth_check = require_admin()
    if auth_check:
        return auth_check

    logs = query_db("""
        SELECT el.*, c.category, c.priority, o1.name AS from_officer, o2.name AS to_officer
        FROM Escalation_Log el
        JOIN Complaint c ON el.complaint_id = c.complaint_id
        JOIN Officer o1 ON el.from_officer = o1.officer_id
        JOIN Officer o2 ON el.to_officer = o2.officer_id
        ORDER BY el.escalated_at DESC
        LIMIT 50
    """)

    return render_template('admin/escalation_log.html', logs=logs)

@bp.route('/run-escalation', methods=['POST'])
def trigger_escalation():
    """Manual trigger button for the SLA escalation stored procedure — perfect for live demo!"""
    auth_check = require_admin()
    if auth_check:
        return auth_check

    # Count overdue before
    before_count = query_db("SELECT COUNT(*) AS count FROM overdue_complaints", one=True)['count']

    # Call the stored procedure
    execute_proc("escalate_overdue_complaints")

    # Count overdue after
    after_count = query_db("SELECT COUNT(*) AS count FROM overdue_complaints", one=True)['count']
    escalated_num = before_count - after_count

    flash(f"Executed stored procedure escalate_overdue_complaints(). {escalated_num} overdue complaints were auto-escalated to supervisors!", "success")
    return redirect(url_for('admin.dashboard'))
