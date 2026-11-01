from flask import Flask, render_template, session, redirect, url_for
from app.config import Config
from app.db import close_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register database teardown
    app.teardown_appcontext(close_db)

    # Register Blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.citizen import bp as citizen_bp
    from app.routes.officer import bp as officer_bp
    from app.routes.admin import bp as admin_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(citizen_bp, url_prefix='/citizen')
    app.register_blueprint(officer_bp, url_prefix='/officer')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    @app.route('/')
    def index():
        role = session.get('role')
        if role == 'citizen':
            return redirect(url_for('citizen.my_complaints'))
        elif role == 'officer':
            return redirect(url_for('officer.dashboard'))
        elif role == 'admin':
            return redirect(url_for('admin.dashboard'))
        return redirect(url_for('auth.login'))

    return app
