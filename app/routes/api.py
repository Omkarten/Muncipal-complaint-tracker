import math
import re
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.db import query_db, execute_proc

bp = Blueprint('api', __name__)

# Category mapping helper between Frontend display names and Database SLA Rules
FRONTEND_TO_DB_CATEGORY = {
    'Roads & Potholes': ('Pothole Repair', 1),
    'Water Supply & Leakages': ('Water Pipeline Leak', 3),
    'Solid Waste & Garbage': ('Garbage Dump Clearance', 4),
    'Drainage & Sewage': ('Sewage Overflow', 3),
    'Streetlights & Electrical': ('Broken Streetlight', 2),
}

DB_TO_FRONTEND_CATEGORY = {
    'Pothole Repair': 'Roads & Potholes',
    'Damaged Footpath': 'Roads & Potholes',
    'Fallen Road Sign': 'Roads & Potholes',
    'Water Pipeline Leak': 'Water Supply & Leakages',
    'No Water Supply': 'Water Supply & Leakages',
    'Sewage Overflow': 'Drainage & Sewage',
    'Garbage Dump Clearance': 'Solid Waste & Garbage',
    'Dead Animal Removal': 'Solid Waste & Garbage',
    'Public Toilet Cleaning': 'Solid Waste & Garbage',
    'Broken Streetlight': 'Streetlights & Electrical',
    'Exposed Electric Wire': 'Streetlights & Electrical',
    'Transformer Sparking': 'Streetlights & Electrical',
    'Mosquito Fogging Request': 'Solid Waste & Garbage',
    'Stray Dog Menace': 'Solid Waste & Garbage',
    'Food Safety Inspection': 'Solid Waste & Garbage',
}

def format_complaint(c):
    """Transforms a raw PostgreSQL complaint row into the frontend schema."""
    cid = c['complaint_id']
    formatted_id = f"MCT-{cid:04d}"

    # Calculate hours
    now = datetime.now()
    filed_at = c.get('filed_at') or now
    deadline_at = c.get('deadline_at') or now
    resolved_at = c.get('resolved_at')

    total_seconds = max(3600, (deadline_at - filed_at).total_seconds())
    sla_total_hours = round(total_seconds / 3600.0)

    elapsed_seconds = max(0, ((resolved_at or now) - filed_at).total_seconds())
    sla_elapsed_hours = round(elapsed_seconds / 3600.0)

    if c['status'] == 'Resolved':
        sla_remaining_hours = 0
    else:
        remaining_seconds = (deadline_at - now).total_seconds()
        sla_remaining_hours = max(0, round(remaining_seconds / 3600.0))

    is_overdue = (c['status'] in ('Open', 'InProgress')) and (deadline_at < now)

    # Determine status label and variant
    db_status = c['status']
    designation = c.get('officer_designation') or 'Field Officer'

    if db_status == 'Resolved':
        status = 'Resolved'
        status_variant = 'on-schedule'
        sla_status_text = f"Resolved within SLA ({sla_elapsed_hours}h of {sla_total_hours}h)"
        sla_variant = 'on-schedule'
    elif db_status == 'Escalated':
        if designation == 'Head':
            status = 'Escalated to Tier 3'
        else:
            status = 'Escalated to Tier 2'
        status_variant = 'escalated'
        sla_status_text = 'SLA Elapsed • Escalated automatically by PostgreSQL stored procedure'
        sla_variant = 'escalated'
    elif is_overdue:
        status = 'Approaching SLA Deadline'
        status_variant = 'warning'
        sla_status_text = f"Overdue by {round((now - deadline_at).total_seconds() / 3600.0)}h • Pending Escalation"
        sla_variant = 'warning'
    elif db_status == 'InProgress':
        status = 'In Progress'
        status_variant = 'in-progress'
        sla_status_text = f"On Schedule ({sla_remaining_hours}h remaining of {sla_total_hours}h)"
        sla_variant = 'on-schedule'
    else: # Open
        status = 'Submitted'
        status_variant = 'in-progress'
        sla_status_text = f"On Schedule (SLA Window: {sla_total_hours}h)"
        sla_variant = 'on-schedule'

    # Determine tier
    if db_status == 'Escalated':
        if designation == 'Head':
            escalation_tier = 'Tier 3'
            escalation_level_name = 'Zonal & Municipal Administration'
        else:
            escalation_tier = 'Tier 2'
            escalation_level_name = 'Sub-Divisional Oversight Level'
    else:
        escalation_tier = 'Tier 1'
        escalation_level_name = 'Ward Field Officer Level'

    # Fetch status history & escalation log for this complaint
    history_rows = query_db("""
        SELECT sh.old_status, sh.new_status, sh.changed_at, o.name AS officer_name
        FROM StatusHistory sh
        LEFT JOIN Officer o ON sh.changed_by = o.officer_id
        WHERE sh.complaint_id = %s
        ORDER BY sh.changed_at ASC
    """, (cid,)) or []

    escalation_rows = query_db("""
        SELECT el.reason, el.escalated_at, o1.name AS from_officer, o2.name AS to_officer
        FROM Escalation_Log el
        LEFT JOIN Officer o1 ON el.from_officer = o1.officer_id
        LEFT JOIN Officer o2 ON el.to_officer = o2.officer_id
        WHERE el.complaint_id = %s
        ORDER BY el.escalated_at ASC
    """, (cid,)) or []

    history = [
        {
            'timestamp': filed_at.strftime('%b %d, %I:%M %p'),
            'text': f"Complaint #{cid} registered by citizen ({c.get('citizen_name', 'Citizen')}). Trigger calculated SLA deadline."
        }
    ]

    for h in history_rows:
        by_text = f" by {h['officer_name']}" if h['officer_name'] else " by System Trigger"
        history.append({
            'timestamp': h['changed_at'].strftime('%b %d, %I:%M %p'),
            'text': f"Status transitioned from {h['old_status']} to {h['new_status']}{by_text}."
        })

    for el in escalation_rows:
        history.append({
            'timestamp': el['escalated_at'].strftime('%b %d, %I:%M %p'),
            'text': f"Automated SLA breach: escalated from {el['from_officer']} to {el['to_officer']} ({el['reason']})."
        })

    # Location display
    ward_name = c.get('ward_name') or 'Ward Central'
    zone = c.get('zone') or 'Central'
    details = c.get('location_details') or ''
    loc_display = f"{ward_name} ({zone} Zone)"
    if details:
        loc_display += f", {details}"

    # Category display
    display_category = DB_TO_FRONTEND_CATEGORY.get(c['category'], c['category'])

    # Title
    title = f"{c['category']} issue"
    if details:
        title += f" near {details[:30]}"
    elif c.get('description'):
        title = c['description'][:45] + ('...' if len(c['description']) > 45 else '')

    return {
        'id': formatted_id,
        'numericId': cid,
        'title': title,
        'category': display_category,
        'dbCategory': c['category'],
        'location': loc_display,
        'wardName': ward_name,
        'zone': zone,
        'priority': c['priority'],
        'description': c.get('description', ''),
        'reportedAt': filed_at.strftime('%b %d, %Y %I:%M %p'),
        'filedAtIso': filed_at.isoformat(),
        'deadlineAtIso': deadline_at.isoformat() if deadline_at else None,
        'status': status,
        'dbStatus': db_status,
        'statusVariant': status_variant,
        'assignedTo': f"{c.get('officer_name', 'Field Officer')} ({c.get('officer_designation', 'Ward Desk')})",
        'assignedOfficerId': c.get('assigned_officer'),
        'escalationTier': escalation_tier,
        'escalationLevelName': escalation_level_name,
        'slaTotalHours': sla_total_hours,
        'slaElapsedHours': sla_elapsed_hours,
        'slaRemainingHours': sla_remaining_hours,
        'slaStatusText': sla_status_text,
        'slaVariant': sla_variant,
        'notes': f"Assigned to {c.get('dept_name', 'Municipal Division')}. Current status: {db_status}.",
        'citizenName': c.get('citizen_name', 'Resident'),
        'citizenPhone': c.get('citizen_phone', ''),
        'history': history
    }

def parse_id(param_id):
    """Parses numeric ID from strings like 'MCT-0042', '42', 'MCT-SAMPLE-002'."""
    if not param_id:
        return None
    # If direct integer
    if str(param_id).isdigit():
        return int(param_id)
    # Extract digits from string
    match = re.search(r'\d+', str(param_id))
    if match:
        return int(match.group(0))
    return None

# ------------------------------------------------------------------------------
# 1. GET /api/complaints
# ------------------------------------------------------------------------------
@bp.route('/complaints', methods=['GET'])
def get_complaints():
    rows = query_db("""
        SELECT c.*, ci.name AS citizen_name, ci.phone AS citizen_phone,
               d.dept_name, w.ward_name, w.zone,
               o.name AS officer_name, o.designation AS officer_designation
        FROM Complaint c
        LEFT JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        ORDER BY c.complaint_id DESC
    """) or []

    formatted = [format_complaint(r) for r in rows]
    return jsonify(formatted)

# ------------------------------------------------------------------------------
# 2. GET /api/complaints/<id>
# ------------------------------------------------------------------------------
@bp.route('/complaints/<path:comp_id>', methods=['GET'])
def get_complaint(comp_id):
    num_id = parse_id(comp_id)
    if not num_id:
        return jsonify({'error': 'Invalid complaint ID'}), 400

    row = query_db("""
        SELECT c.*, ci.name AS citizen_name, ci.phone AS citizen_phone,
               d.dept_name, w.ward_name, w.zone,
               o.name AS officer_name, o.designation AS officer_designation
        FROM Complaint c
        LEFT JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        WHERE c.complaint_id = %s
    """, (num_id,), one=True)

    if not row:
        return jsonify({'error': f'Complaint #{comp_id} not found'}), 404

    return jsonify(format_complaint(row))

# ------------------------------------------------------------------------------
# 3. POST /api/complaints
# ------------------------------------------------------------------------------
@bp.route('/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json() or {}

    category_input = data.get('category', 'Roads & Potholes')
    priority = data.get('priority', 'Medium')
    description = data.get('description', '')
    location = data.get('location', '')
    citizen_name = data.get('citizenName', 'Demo Resident')
    citizen_phone = data.get('citizenPhone', '9876543210')

    # Priority normalization
    if priority == 'Emergency':
        priority = 'Critical'
    elif priority == 'Urgent':
        priority = 'High'
    elif priority not in ('Low', 'Medium', 'High', 'Critical'):
        priority = 'Medium'

    # Map category to DB category and department
    if category_input in FRONTEND_TO_DB_CATEGORY:
        db_category, dept_id = FRONTEND_TO_DB_CATEGORY[category_input]
    else:
        # Check if direct DB category match exists
        rule = query_db("SELECT category, dept_id FROM SLA_Rule WHERE category = %s LIMIT 1", (category_input,), one=True)
        if rule:
            db_category, dept_id = rule['category'], rule['dept_id']
        else:
            db_category, dept_id = 'Pothole Repair', 1

    # Find or create citizen
    citizen = query_db("SELECT citizen_id FROM Citizen WHERE phone = %s", (citizen_phone,), one=True)
    if citizen:
        citizen_id = citizen['citizen_id']
    else:
        # Pick default citizen 1 or insert
        citizen_id = 1

    # Select ward by match or default
    ward_id = 2 # default Malleshwaram
    if location:
        ward_match = query_db("SELECT ward_id FROM Ward WHERE ward_name ILIKE %s LIMIT 1", (f"%{location.split(',')[0]}%",), one=True)
        if ward_match:
            ward_id = ward_match['ward_id']

    # Assign active field officer for that department
    assigned_officer = query_db("""
        SELECT officer_id FROM Officer
        WHERE dept_id = %s AND designation = 'Field Officer'
        ORDER BY RANDOM() LIMIT 1
    """, (dept_id,), one=True)
    officer_id = assigned_officer['officer_id'] if assigned_officer else 11

    # Insert complaint into PostgreSQL - trigger trg_set_deadline calculates deadline_at automatically!
    query_db("""
        INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Open', NOW())
    """, (citizen_id, db_category, priority, description, ward_id, location, dept_id, officer_id), commit=True)

    # Retrieve inserted row
    new_row = query_db("""
        SELECT c.*, ci.name AS citizen_name, ci.phone AS citizen_phone,
               d.dept_name, w.ward_name, w.zone,
               o.name AS officer_name, o.designation AS officer_designation
        FROM Complaint c
        LEFT JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        ORDER BY c.complaint_id DESC LIMIT 1
    """, one=True)

    formatted = format_complaint(new_row)
    return jsonify(formatted), 201

# ------------------------------------------------------------------------------
# 4. POST /api/complaints/<id>/status
# ------------------------------------------------------------------------------
@bp.route('/complaints/<path:comp_id>/status', methods=['POST'])
def update_status(comp_id):
    num_id = parse_id(comp_id)
    if not num_id:
        return jsonify({'error': 'Invalid complaint ID'}), 400

    data = request.get_json() or {}
    new_status_raw = data.get('status', 'In Progress')
    notes = data.get('notes', '')

    # Map frontend status to DB status
    if 'Resolve' in new_status_raw:
        db_status = 'Resolved'
    elif 'Escalate' in new_status_raw:
        db_status = 'Escalated'
    elif 'Progress' in new_status_raw:
        db_status = 'InProgress'
    elif 'Close' in new_status_raw:
        db_status = 'Closed'
    else:
        db_status = 'Open'

    # If Escalating, look up supervisor
    if db_status == 'Escalated':
        officer_info = query_db("""
            SELECT c.assigned_officer, o.supervisor_id
            FROM Complaint c
            LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
            WHERE c.complaint_id = %s
        """, (num_id,), one=True)

        if officer_info and officer_info.get('supervisor_id'):
            new_officer = officer_info['supervisor_id']
            query_db("""
                UPDATE Complaint
                SET status = 'Escalated', assigned_officer = %s
                WHERE complaint_id = %s
            """, (new_officer, num_id), commit=True)

            query_db("""
                INSERT INTO Escalation_Log (complaint_id, from_officer, to_officer, reason, escalated_at)
                VALUES (%s, %s, %s, %s, NOW())
            """, (num_id, officer_info['assigned_officer'], new_officer, notes or 'Field staff manual escalation to supervisory tier'), commit=True)
        else:
            query_db("UPDATE Complaint SET status = 'Escalated' WHERE complaint_id = %s", (num_id,), commit=True)
    else:
        # Normal status update (triggers trg_log_status and trg_handle_status_prereq automatically)
        query_db("""
            UPDATE Complaint
            SET status = %s
            WHERE complaint_id = %s
        """, (db_status, num_id), commit=True)

    # Fetch updated row
    updated_row = query_db("""
        SELECT c.*, ci.name AS citizen_name, ci.phone AS citizen_phone,
               d.dept_name, w.ward_name, w.zone,
               o.name AS officer_name, o.designation AS officer_designation
        FROM Complaint c
        LEFT JOIN Citizen ci ON c.citizen_id = ci.citizen_id
        LEFT JOIN Department d ON c.dept_id = d.dept_id
        LEFT JOIN Ward w ON c.ward_id = w.ward_id
        LEFT JOIN Officer o ON c.assigned_officer = o.officer_id
        WHERE c.complaint_id = %s
    """, (num_id,), one=True)

    return jsonify(format_complaint(updated_row))

# ------------------------------------------------------------------------------
# 5. POST /api/admin/escalate (Run PostgreSQL Stored Procedure)
# ------------------------------------------------------------------------------
@bp.route('/admin/escalate', methods=['POST'])
def trigger_escalation_proc():
    # Count overdue before
    before = query_db("SELECT COUNT(*) AS c FROM overdue_complaints", one=True)['c']
    # Call stored procedure
    execute_proc("escalate_overdue_complaints")
    after = query_db("SELECT COUNT(*) AS c FROM overdue_complaints", one=True)['c']

    escalated_count = before - after
    return jsonify({
        'success': True,
        'escalatedCount': escalated_count,
        'message': f"Executed PostgreSQL stored procedure escalate_overdue_complaints(). {escalated_count} overdue complaints escalated to supervisors."
    })

# ------------------------------------------------------------------------------
# 6. GET /api/admin/stats
# ------------------------------------------------------------------------------
@bp.route('/admin/stats', methods=['GET'])
def get_admin_stats():
    # Overall summary counts
    counts = query_db("""
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
            COUNT(*) FILTER (WHERE status = 'InProgress' OR status = 'Open') AS in_progress,
            COUNT(*) FILTER (WHERE status = 'Escalated') AS escalated,
            COUNT(*) FILTER (WHERE (status = 'Open' OR status = 'InProgress') AND deadline_at < NOW()) AS overdue
        FROM Complaint
    """, one=True) or {}

    total = counts.get('total', 0)
    resolved = counts.get('resolved', 0)
    escalated = counts.get('escalated', 0)
    compliance_rate = round(((total - escalated) / total) * 100) if total > 0 else 100

    dept_perf = query_db("SELECT * FROM dept_performance ORDER BY resolution_percentage DESC") or []
    ward_sum = query_db("SELECT * FROM ward_summary ORDER BY total_complaints DESC LIMIT 10") or []

    # Category counts
    cats = query_db("""
        SELECT category, COUNT(*) AS count
        FROM Complaint
        GROUP BY category
        ORDER BY count DESC
    """) or []

    return jsonify({
        'total': total,
        'resolved': resolved,
        'inProgress': counts.get('in_progress', 0),
        'escalated': escalated,
        'overdue': counts.get('overdue', 0),
        'complianceRate': compliance_rate,
        'deptPerformance': dept_perf,
        'wardSummary': ward_sum,
        'categoryStats': cats
    })

# ------------------------------------------------------------------------------
# 7. GET /api/officer/<id>/hierarchy (Recursive CTE)
# ------------------------------------------------------------------------------
@bp.route('/officer/<int:officer_id>/hierarchy', methods=['GET'])
def get_officer_hierarchy(officer_id):
    hierarchy = query_db("""
        WITH RECURSIVE OfficerHierarchy AS (
            SELECT officer_id, name, designation, supervisor_id, 1 AS level
            FROM Officer
            WHERE officer_id = %s
            UNION ALL
            SELECT o.officer_id, o.name, o.designation, o.supervisor_id, oh.level + 1
            FROM Officer o
            JOIN OfficerHierarchy oh ON o.officer_id = oh.supervisor_id
        )
        SELECT * FROM OfficerHierarchy ORDER BY level ASC;
    """, (officer_id,)) or []

    return jsonify(hierarchy)

# ------------------------------------------------------------------------------
# 8. GET /api/meta (Dropdown lists)
# ------------------------------------------------------------------------------
@bp.route('/meta', methods=['GET'])
def get_meta():
    departments = query_db("SELECT * FROM Department ORDER BY dept_id") or []
    wards = query_db("SELECT * FROM Ward ORDER BY zone, ward_name") or []
    sla_rules = query_db("""
        SELECT s.*, d.dept_name
        FROM SLA_Rule s
        JOIN Department d ON s.dept_id = d.dept_id
        ORDER BY d.dept_name, s.category
    """) or []
    officers = query_db("""
        SELECT o.officer_id, o.name, o.designation, o.email, d.dept_name
        FROM Officer o
        JOIN Department d ON o.dept_id = d.dept_id
        ORDER BY o.dept_id, o.officer_id
    """) or []
    citizens = query_db("SELECT citizen_id, name, phone, email, address FROM Citizen ORDER BY citizen_id LIMIT 25") or []

    return jsonify({
        'departments': departments,
        'wards': wards,
        'slaRules': sla_rules,
        'officers': officers,
        'citizens': citizens
    })
