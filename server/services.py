import random
import time
from database import get_connection
from models import Workout, TimeSeriesPoint, DailyLog
from typing import List

# Insert operations
def insert_workout(workout: Workout) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO workout (avg_heart_rate, avg_speed, max_speed, duration_seconds, start_time)
        VALUES (?, ?, ?, ?, ?)
    """, (workout.avg_heart_rate, workout.avg_speed, workout.max_speed, workout.duration_seconds, workout.start_time))
    workout_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return workout_id

def update_workout(workout: Workout):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE workout
        SET avg_heart_rate = ?, avg_speed = ?, max_speed = ?, duration_seconds = ?, start_time = ?
        WHERE id = ?
    """, (workout.avg_heart_rate, workout.avg_speed, workout.max_speed, workout.duration_seconds, workout.start_time, workout.id))
    conn.commit()
    conn.close()

def insert_time_series(point: List[TimeSeriesPoint]):
    conn = get_connection()
    cursor = conn.cursor()
    for p in point:
        cursor.execute("""
            INSERT INTO time_series_data (workout_id, timestamp, speed, heart_rate, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (p.workout_id, p.timestamp, p.speed, p.heart_rate, p.latitude, p.longitude))

    conn.commit()
    conn.close()

def insert_daily_log(log: DailyLog):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO daily_log (id, date, sleep_seconds, calories, weight_kg)
        VALUES (?, ?, ?, ?, ?)
    """, (log.id, log.date, log.sleep_seconds, log.calories, log.weight_kg))
    conn.commit()
    conn.close()

def update_daily_log(log: DailyLog):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE daily_log
        SET sleep_seconds = ?, calories = ?, weight_kg = ?
        WHERE id = ?
    """, (log.sleep_seconds, log.calories, log.weight_kg, log.id))
    conn.commit()
    conn.close()

# Retrieve workouts
def get_all_workouts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workout")
    workouts = cursor.fetchall()
    conn.close()
    return [dict(row) for row in workouts]

def get_workout_timeseries(workout_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM time_series_data WHERE workout_id = ?
    """, (workout_id,))
    timeseries = cursor.fetchall()
    conn.close()
    # Return a TimeSeriesPoint list
    if not timeseries:
        return []
    return [TimeSeriesPoint(**row) for row in timeseries]


def get_daily_logs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM daily_log")
    logs = cursor.fetchall()
    conn.close()
    return [dict(row) for row in logs]

# Fake data generator
def generate_fake_workout():
    conn = get_connection()
    cursor = conn.cursor()

    # Fake workout
    avg_hr = round(random.uniform(120, 170), 1)
    avg_speed = round(random.uniform(2.5, 4.5), 2)
    max_speed = round(avg_speed + random.uniform(1.0, 3.0), 2)
    duration = random.randint(900, 5400)

    cursor.execute("""
        INSERT INTO workout (avg_heart_rate, avg_speed, max_speed, duration_seconds)
        VALUES (?, ?, ?, ?)
    """, (avg_hr, avg_speed, max_speed, duration))
    workout_id = cursor.lastrowid

    # Time series data (every 5s)
    num_points = duration // 5
    start_time = int(time.time()) - duration
    lat, lon = 48.8566, 2.3522
    for i in range(num_points):
        ts = start_time + (i * 5)
        speed = round(random.uniform(2.0, 5.0), 2)
        hr = round(random.uniform(100, 180), 1)
        lat += random.uniform(-0.0001, 0.0001)
        lon += random.uniform(-0.0001, 0.0001)
        cursor.execute("""
            INSERT INTO time_series_data (workout_id, timestamp, speed, heart_rate, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (workout_id, ts, speed, hr, lat, lon))

    # Daily log
    date = time.strftime('%Y-%m-%d', time.localtime(start_time))
    sleep_sec = random.randint(18000, 32400)
    calories = round(random.uniform(1800, 3500), 1)
    weight = round(random.uniform(55, 90), 1)
    cursor.execute("""
        INSERT INTO daily_log (workout_id, date, sleep_seconds, calories, weight_kg)
        VALUES (?, ?, ?, ?, ?)
    """, (workout_id,date, sleep_sec, calories, weight))

    conn.commit()
    conn.close()
    return workout_id
