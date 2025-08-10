export type Workout = {
    avg_heart_rate: number;
    avg_speed: number;
    max_speed: number;
    duration_seconds: number;
}

export type TimeSeriesPoint = {
    workout_id: string;
    timestamp: number; // Unix timestamp in milliseconds
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