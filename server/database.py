import sqlite3

DB_NAME = "running_coach.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Workout table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workout (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            avg_heart_rate REAL,
            avg_speed REAL,
            max_speed REAL,
            duration_seconds INTEGER
        )
    """)

    # Time series data table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS time_series_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER,
            timestamp INTEGER,
            speed REAL,
            heart_rate REAL,
            latitude REAL,
            longitude REAL,
            FOREIGN KEY (workout_id) REFERENCES workout (id)
        )
    """)

    # Daily log table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER,
            sleep_seconds INTEGER,
            calories REAL,
            weight_kg REAL,
            FOREIGN KEY (workout_id) REFERENCES workout (id)
        )
    """)

    conn.commit()
    conn.close()
