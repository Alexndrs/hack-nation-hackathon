from pydantic import BaseModel

class Workout(BaseModel):
    id: int
    avg_heart_rate: float
    avg_speed: float
    max_speed: float
    duration_seconds: int
    start_time: str

class TimeSeriesPoint(BaseModel):
    workout_id: int
    timestamp: int
    speed: float
    heart_rate: float
    latitude: float
    longitude: float

class DailyLog(BaseModel):
    id: int
    date: str
    sleep_seconds: int
    calories: float
    weight_kg: float
