import psycopg2
from psycopg2.extras import RealDictCursor
from flask import g, current_app, has_app_context

def get_db():
    """Opens a new database connection if there is none yet for the current application context."""
    if 'db' not in g:
        g.db = psycopg2.connect(
            dbname=current_app.config['DB_NAME'],
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            host=current_app.config['DB_HOST'],
            port=current_app.config['DB_PORT'],
            cursor_factory=RealDictCursor
        )
    return g.db

def close_db(e=None):
    """Closes the database again at the end of the request/app context."""
    if has_app_context():
        db = g.pop('db', None)
        if db is not None:
            db.close()

def query_db(query, args=(), one=False, commit=False):
    """Executes a SQL query with parameters and returns RealDict rows."""
    conn = get_db()
    with conn.cursor() as cur:
        cur.execute(query, args)
        if commit:
            conn.commit()
            return cur.rowcount
        try:
            rv = cur.fetchall()
            return (rv[0] if rv else None) if one else rv
        except psycopg2.ProgrammingError:
            return None

def execute_proc(proc_name, args=()):
    """Executes a stored procedure (CALL proc_name(...)) and commits."""
    conn = get_db()
    with conn.cursor() as cur:
        placeholders = ', '.join(['%s'] * len(args))
        sql = f"CALL {proc_name}({placeholders});" if args else f"CALL {proc_name}();"
        cur.execute(sql, args)
        conn.commit()
