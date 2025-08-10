export type Workout = {
    id: number;
    avg_heart_rate: number;
    avg_speed: number;
    max_speed: number;
    duration_seconds: number;
    start_time: string;
}

export type TimeSeriesPoint = {
    workout_id: number;
    timestamp: number; // Unix timestamp in milliseconds
    speed: number;
    heart_rate: number;
    latitude: number;
    longitude: number;
}

export type DailyLog = {
    date: string;
    sleep_seconds: number;
    calories: number;
    weight_kg: number;
}