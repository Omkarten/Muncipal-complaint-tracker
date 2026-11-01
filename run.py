from app import create_app
from scheduler import start_scheduler

app = create_app()

if __name__ == '__main__':
    # Start the automated SLA background scheduler
    scheduler = start_scheduler()
    print("Municipal Complaint Tracker started with background SLA scheduler.")
    try:
        app.run(host='0.0.0.0', port=app.config.get('FLASK_PORT', 5000), debug=True)
    finally:
        scheduler.shutdown()
