from pydantic import BaseModel

class Workout(BaseModel):
    avg_heart_rate: float
    avg_speed: float
    max_speed: float
    duration_seconds: int

class TimeSeriesPoint(BaseModel):
    workout_id: int
    timestamp: int
    speed: float
    heart_rate: float
    latitude: float
    longitude: float

class DailyLog(BaseModel):
    date: str
    sleep_seconds: int
    calories: float
    weight_kg: float
