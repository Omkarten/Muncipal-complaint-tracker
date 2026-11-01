import os
import psycopg2
from apscheduler.schedulers.background import BackgroundScheduler
from app.config import Config

def run_sla_escalation_job():
    """Scheduled task that invokes the PostgreSQL stored procedure."""
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT
        )
        with conn.cursor() as cur:
            cur.execute("CALL escalate_overdue_complaints();")
            conn.commit()
        conn.close()
        print("[Scheduler] Automated SLA escalation scan completed successfully.")
    except Exception as e:
        print(f"[Scheduler Error] Could not run SLA escalation: {e}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Runs hourly in production, check every 5 minutes in development
    scheduler.add_job(func=run_sla_escalation_job, trigger="interval", minutes=5, id="sla_escalation")
    scheduler.start()
    return scheduler
