from fastapi import APIRouter
from models import Workout, TimeSeriesPoint, DailyLog
import services

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Running Coach API is running!"}

@router.get("/workouts")
def get_workouts():
    return services.get_all_workouts()

@router.post("/workouts")
def add_workout(workout: Workout):
    workout_id = services.insert_workout(workout)
    return {"status": "Workout added", "workout_id": workout_id}

@router.post("/time-series")
def add_time_series(point: TimeSeriesPoint):
    services.insert_time_series(point)
    return {"status": "Time series point added"}

@router.post("/daily-log")
def add_daily_log(log: DailyLog):
    services.insert_daily_log(log)
    return {"status": "Daily log added"}

@router.post("/generate-fake-workout")
def generate_fake():
    workout_id = services.generate_fake_workout()
    return {"status": "Fake workout generated", "workout_id": workout_id}
