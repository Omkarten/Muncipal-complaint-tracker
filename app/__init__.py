import os
from flask import Flask, render_template, session, redirect, url_for, send_from_directory, request, make_response
from app.config import Config
from app.db import close_db

def create_app():
    # Detect frontend build path
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    dist_dir = os.path.join(base_dir, 'frontend', 'dist')

    app = Flask(__name__)
    app.config.from_object(Config)

    # Register database teardown
    app.teardown_appcontext(close_db)

    # CORS support for Vite dev server & API calls
    @app.after_request
    def apply_cors(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return response

    @app.route('/api', methods=['OPTIONS'])
    @app.route('/api/<path:subpath>', methods=['OPTIONS'])
    def handle_options(subpath=''):
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return response

    # Register API Blueprint
    from app.routes.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Register Classic SSR Blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.citizen import bp as citizen_bp
    from app.routes.officer import bp as officer_bp
    from app.routes.admin import bp as admin_bp

    app.register_blueprint(auth_bp, url_prefix='/classic/auth')
    app.register_blueprint(citizen_bp, url_prefix='/classic/citizen')
    app.register_blueprint(officer_bp, url_prefix='/classic/officer')
    app.register_blueprint(admin_bp, url_prefix='/classic/admin')

    @app.route('/classic', endpoint='index')
    @app.route('/classic/dashboard', endpoint='classic_index')
    def classic_index():
        role = session.get('role')
        if role == 'citizen':
            return redirect(url_for('citizen.my_complaints'))
        elif role == 'officer':
            return redirect(url_for('officer.dashboard'))
        elif role == 'admin':
            return redirect(url_for('admin.dashboard'))
        return redirect(url_for('auth.login'))

    # SPA Static Serving
    if os.path.exists(dist_dir):
        @app.route('/assets/<path:filename>')
        def serve_assets(filename):
            return send_from_directory(os.path.join(dist_dir, 'assets'), filename)

        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_spa(path):
            # Don't hijack API or classic routes
            if path.startswith('api') or path.startswith('classic'):
                return "Not Found", 404

            target_file = os.path.join(dist_dir, path)
            if path and os.path.exists(target_file) and not os.path.isdir(target_file):
                return send_from_directory(dist_dir, path)
            # Default to index.html for client-side routing
            return send_from_directory(dist_dir, 'index.html')
    else:
        @app.route('/')
        def index():
            return redirect(url_for('classic_index'))

    return app
