from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.db import query_db

bp = Blueprint('citizen', __name__)

def require_citizen():
    if session.get('role') != 'citizen' or 'user_id' not in session:
        flash("Please log in as a citizen.", "warning")
        return redirect(url_for('auth.login'))
    return None

@bp.route('/my-complaints')
def my_complaints():
    auth_check = require_citizen()
    if auth_check:
        return auth_check

    citizen_id = session['user_id']
    complaints = query_db("""
        SELECT c.*, d.dept_name, w.ward_name, w.zone, o.name AS officer_name,
               f.rating AS feedback_rating
        FROM Complaint c
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        LEFT JOIN Feedback f ON c.complaint_id = f.complaint_id
        WHERE c.citizen_id = %s
        ORDER BY c.filed_at DESC
    """, (citizen_id,))

    # Count unread notifications
    unread_count = query_db(
        "SELECT COUNT(*) AS count FROM Notification WHERE citizen_id = %s AND is_read = FALSE",
        (citizen_id,),
        one=True
    )['count']

    return render_template('citizen/my_complaints.html', complaints=complaints, unread_count=unread_count)

@bp.route('/file', methods=['GET', 'POST'])
def file_complaint():
    auth_check = require_citizen()
    if auth_check:
        return auth_check

    citizen_id = session['user_id']

    if request.method == 'POST':
        category = request.form.get('category')
        priority = request.form.get('priority', 'Medium')
        ward_id = request.form.get('ward_id')
        location_details = request.form.get('location_details')
        description = request.form.get('description')

        # Lookup department associated with this category in SLA_Rule
        rule = query_db("SELECT dept_id, resolution_hours FROM SLA_Rule WHERE category = %s LIMIT 1", (category,), one=True)
        if not rule:
            flash("Selected category does not have a routing department configured.", "danger")
            return redirect(url_for('citizen.file_complaint'))

        dept_id = rule['dept_id']

        # Automatically assign an active Field Officer in that department
        assigned_officer = query_db("""
            SELECT officer_id FROM Officer
            WHERE dept_id = %s AND designation = 'Field Officer'
            ORDER BY RANDOM() LIMIT 1
        """, (dept_id,), one=True)

        officer_id = assigned_officer['officer_id'] if assigned_officer else None

        # Insert complaint - trigger 'trg_set_deadline' automatically computes deadline_at!
        query_db("""
            INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Open', NOW())
        """, (citizen_id, category, priority, description, ward_id, location_details, dept_id, officer_id), commit=True)

        flash("Complaint registered successfully! SLA resolution deadline has been assigned.", "success")
        return redirect(url_for('citizen.my_complaints'))

    # Load categories, wards, and SLA rules for user guidance
    categories = query_db("""
        SELECT s.category, s.resolution_hours, d.dept_name
        FROM SLA_Rule s
        JOIN Department d ON s.dept_id = d.dept_id
        ORDER BY d.dept_name, s.category
    """)
    wards = query_db("SELECT * FROM Ward ORDER BY zone, ward_name")

    return render_template('citizen/file_complaint.html', categories=categories, wards=wards)

@bp.route('/complaint/<int:complaint_id>')
def complaint_detail(complaint_id):
    auth_check = require_citizen()
    if auth_check:
        return auth_check

    citizen_id = session['user_id']
    complaint = query_db("""
        SELECT c.*, d.dept_name, w.ward_name, w.zone, o.name AS officer_name, o.designation AS officer_designation
        FROM Complaint c
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        WHERE c.complaint_id = %s AND c.citizen_id = %s
    """, (complaint_id, citizen_id), one=True)

    if not complaint:
        flash("Complaint not found or unauthorized.", "danger")
        return redirect(url_for('citizen.my_complaints'))

    # Get status history audit log
    history = query_db("""
        SELECT sh.*, o.name AS changed_by_name
        FROM StatusHistory sh
        LEFT JOIN Officer o ON sh.changed_by = o.officer_id
        WHERE sh.complaint_id = %s
        ORDER BY sh.changed_at ASC
    """, (complaint_id,))

    # Get escalation log
    escalations = query_db("""
        SELECT el.*, o1.name AS from_officer_name, o2.name AS to_officer_name
        FROM Escalation_Log el
        LEFT JOIN Officer o1 ON el.from_officer = o1.officer_id
        LEFT JOIN Officer o2 ON el.to_officer = o2.officer_id
        WHERE el.complaint_id = %s
        ORDER BY el.escalated_at ASC
    """, (complaint_id,))

    # Existing feedback if any
    feedback = query_db("SELECT * FROM Feedback WHERE complaint_id = %s", (complaint_id,), one=True)

    return render_template(
        'citizen/complaint_detail.html',
        complaint=complaint,
        history=history,
        escalations=escalations,
        feedback=feedback
    )

@bp.route('/feedback/<int:complaint_id>', methods=['POST'])
def submit_feedback(complaint_id):
    auth_check = require_citizen()
    if auth_check:
        return auth_check

    citizen_id = session['user_id']
    complaint = query_db(
        "SELECT * FROM Complaint WHERE complaint_id = %s AND citizen_id = %s",
        (complaint_id, citizen_id),
        one=True
    )
    if not complaint or complaint['status'] != 'Resolved':
        flash("Feedback can only be submitted for resolved complaints.", "warning")
        return redirect(url_for('citizen.my_complaints'))

    rating = int(request.form.get('rating', 5))
    comments = request.form.get('comments', '').strip()

    query_db("""
        INSERT INTO Feedback (complaint_id, rating, comments, submitted_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (complaint_id) DO UPDATE SET rating = EXCLUDED.rating, comments = EXCLUDED.comments, submitted_at = NOW()
    """, (complaint_id, rating, comments), commit=True)

    flash("Thank you for your feedback!", "success")
    return redirect(url_for('citizen.complaint_detail', complaint_id=complaint_id))

@bp.route('/notifications')
def notifications():
    auth_check = require_citizen()
    if auth_check:
        return auth_check

    citizen_id = session['user_id']
    notes = query_db("""
        SELECT * FROM Notification
        WHERE citizen_id = %s
        ORDER BY sent_at DESC
    """, (citizen_id,))

    # Mark all as read
    query_db("UPDATE Notification SET is_read = TRUE WHERE citizen_id = %s", (citizen_id,), commit=True)

    return render_template('citizen/notifications.html', notifications=notes)
