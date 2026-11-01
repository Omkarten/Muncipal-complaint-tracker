import re
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.db import query_db

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        role = request.form.get('role')

        if role == 'citizen':
            citizen_id = request.form.get('citizen_id')
            citizen = query_db("SELECT * FROM Citizen WHERE citizen_id = %s", (citizen_id,), one=True)
            if citizen:
                session.clear()
                session['user_id'] = citizen['citizen_id']
                session['name'] = citizen['name']
                session['role'] = 'citizen'
                flash(f"Welcome, {citizen['name']}!", "success")
                return redirect(url_for('citizen.my_complaints'))
            else:
                flash("Citizen account not found.", "danger")

        elif role == 'officer':
            officer_id = request.form.get('officer_id')
            officer = query_db(
                "SELECT o.*, d.dept_name FROM Officer o JOIN Department d ON o.dept_id = d.dept_id WHERE o.officer_id = %s",
                (officer_id,),
                one=True
            )
            if officer:
                session.clear()
                session['user_id'] = officer['officer_id']
                session['name'] = officer['name']
                session['designation'] = officer['designation']
                session['dept_name'] = officer['dept_name']
                session['role'] = 'officer'
                flash(f"Welcome Officer {officer['name']} ({officer['designation']} - {officer['dept_name']})", "success")
                return redirect(url_for('officer.dashboard'))
            else:
                flash("Officer not found.", "danger")

        elif role == 'admin':
            session.clear()
            session['user_id'] = 0
            session['name'] = "Municipal Commissioner / Administrator"
            session['role'] = 'admin'
            flash("Logged in as Municipal Administrator.", "info")
            return redirect(url_for('admin.dashboard'))

    citizens = query_db("SELECT citizen_id, name, phone FROM Citizen ORDER BY citizen_id LIMIT 15")
    officers = query_db("SELECT o.officer_id, o.name, o.designation, d.dept_name FROM Officer o JOIN Department d ON o.dept_id = d.dept_id ORDER BY o.officer_id")
    return render_template('login.html', citizens=citizens, officers=officers)

@bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('name', '').strip()
    phone = request.form.get('phone', '').strip()
    email = request.form.get('email', '').strip()
    address = request.form.get('address', '').strip()

    # Validation
    if not name or not phone:
        flash("Name and Phone number are required.", "danger")
        return redirect(url_for('auth.login'))

    # Validate phone format (10-15 digits)
    if not re.match(r'^\d{10,15}$', phone):
        flash("Please enter a valid 10 to 15-digit phone number.", "warning")
        return redirect(url_for('auth.login'))

    # Check for duplicate phone
    existing = query_db("SELECT citizen_id FROM Citizen WHERE phone = %s", (phone,), one=True)
    if existing:
        flash("A citizen account is already registered with this phone number. Please choose your name from the login list.", "warning")
        return redirect(url_for('auth.login'))

    # Insert new citizen
    query_db("""
        INSERT INTO Citizen (name, phone, email, address)
        VALUES (%s, %s, %s, %s)
    """, (name, phone, email or None, address or None), commit=True)

    new_citizen = query_db("SELECT * FROM Citizen WHERE phone = %s", (phone,), one=True)
    session.clear()
    session['user_id'] = new_citizen['citizen_id']
    session['name'] = new_citizen['name']
    session['role'] = 'citizen'

    flash(f"Account registered successfully! Welcome, {name}.", "success")
    return redirect(url_for('citizen.my_complaints'))

@bp.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for('auth.login'))
