import random
import time
import sqlite3
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

DB_NAME = "running_coach.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def generate_fake_workout():
    avg_heart_rate = random.uniform(120, 170)  # bpm
    avg_speed = random.uniform(2.5, 4.5)       # m/s (≈ 9–16 km/h)
    max_speed = avg_speed + random.uniform(1.0, 3.0)
    duration_seconds = random.randint(900, 5400)  # 15 min to 1.5 h

    return {
        "avg_heart_rate": round(avg_heart_rate, 1),
        "avg_speed": round(avg_speed, 2),
        "max_speed": round(max_speed, 2),
        "duration_seconds": duration_seconds
    }

def generate_time_series(workout_id, duration_seconds):
    conn = get_connection()
    cursor = conn.cursor()

    num_points = duration_seconds // 5  # one point every 5 seconds
    start_time = int(time.time()) - duration_seconds

    lat, lon = 48.8566, 2.3522  # Start in Paris for realism

    for i in range(num_points):
        timestamp = start_time + (i * 5)
        speed = random.uniform(2.0, 5.0)
        heart_rate = random.uniform(100, 180)
        lat += random.uniform(-0.0001, 0.0001)
        lon += random.uniform(-0.0001, 0.0001)

        cursor.execute("""
            INSERT INTO time_series_data (workout_id, timestamp, speed, heart_rate, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (workout_id, timestamp, round(speed, 2), round(heart_rate, 1), round(lat, 6), round(lon, 6)))

    conn.commit()
    conn.close()

def generate_daily_log(workout_id):
    conn = get_connection()
    cursor = conn.cursor()

    sleep_seconds = random.randint(18000, 32400)  # 5–9 hours
    calories = random.uniform(1800, 3500)
    weight = random.uniform(55, 90)

    cursor.execute("""
        INSERT INTO daily_log (workout_id, sleep_seconds, calories, weight_kg)
        VALUES (?, ?, ?, ?)
    """, (workout_id, sleep_seconds, round(calories, 1), round(weight, 1)))

    conn.commit()
    conn.close()

def insert_fake_workout():
    conn = get_connection()
    cursor = conn.cursor()

    workout_data = generate_fake_workout()
    cursor.execute("""
        INSERT INTO workout (avg_heart_rate, avg_speed, max_speed, duration_seconds)
        VALUES (?, ?, ?, ?)
    """, (workout_data["avg_heart_rate"], workout_data["avg_speed"],
          workout_data["max_speed"], workout_data["duration_seconds"]))

    workout_id = cursor.lastrowid
    conn.commit()
    conn.close()

    # Add related time series + daily log
    generate_time_series(workout_id, workout_data["duration_seconds"])
    generate_daily_log(workout_id)

    return workout_id

if __name__ == "__main__":
    num_fake_entries = 5
    for _ in range(num_fake_entries):
        wid = insert_fake_workout()
        print(f"Inserted fake workout ID: {wid}")
