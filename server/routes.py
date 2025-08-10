from fastapi import APIRouter, UploadFile, File
from models import Workout, TimeSeriesPoint, DailyLog
import services
import shutil
import os
from typing import List

router = APIRouter()

@router.get("/handshake")
def root():
    return {"message": "Running Coach API is running!"}

@router.get("/workouts")
def get_workouts():
    return services.get_all_workouts()

@router.post("/workouts")
def add_workout(workout: Workout):
    print(workout)
    workout_id = services.insert_workout(workout)
    return {"status": "Workout added", "workout_id": workout_id}

@router.patch("/workouts")
def update_workout(workout: Workout):
    print(workout)
    services.update_workout(workout)
    return {"status": "Workout updated"}

@router.get("/daily-logs")
def get_daily_logs():
    return services.get_daily_logs()

@router.post("/time-series")
def add_time_series(point: List[TimeSeriesPoint]):
    services.insert_time_series(point)
    return {"status": "Time series point added"}

@router.post("/daily-log")
def add_daily_log(log: DailyLog):
    services.insert_daily_log(log)
    return {"status": "Daily log added"}

@router.patch("/daily-log")
def update_daily_log(log: DailyLog):
    print(log)
    services.update_daily_log(log)
    return {"status": "Daily log updated"}

@router.post("/generate-fake-workout")
def generate_fake():
    workout_id = services.generate_fake_workout()
    return {"status": "Fake workout generated", "workout_id": workout_id}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "success", "file_path": file_path}