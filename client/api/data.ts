import { SERVER_URL } from "./config";
import { DailyLog, TimeSeriesPoint, Workout } from "./types";

export async function handshake() {
    const response = await fetch(`${SERVER_URL}/handshake`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Handshake failed");
    }

    return response.json();
}

export async function getWorkouts(): Promise<Workout[]> {
    const response = await fetch(`${SERVER_URL}/workouts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch workouts");
    }

    return response.json();
}

export async function postWorkout(workout: Workout): Promise<{ status: string, workout_id: number }> {

    console.log("Posting workout:", workout, "to", `${SERVER_URL}/workouts`);


    const response = await fetch(`${SERVER_URL}/workouts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
    });

    console.log("Response from postWorkout: ", response);

    if (!response.ok) {
        throw new Error("Failed to post workout");
    }

    return response.json();
}

export async function patchWorkout(workout: Workout): Promise<void> {
    const response = await fetch(`${SERVER_URL}/workouts`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
    });

    if (!response.ok) {
        throw new Error("Failed to patch workout");
    }
}

export async function postTimeSeriesPoints(points: TimeSeriesPoint[]): Promise<void> {
    const response = await fetch(`${SERVER_URL}/time-series`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(points),
    });

    if (!response.ok) {
        throw new Error("Failed to post time series points");
    }
}

export async function postDailyLog(dailyLog: DailyLog): Promise<void> {
    const response = await fetch(`${SERVER_URL}/daily-log`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dailyLog),
    });

    if (!response.ok) {
        throw new Error("Failed to post daily log");
    }
}

export async function getDailyLogs(): Promise<DailyLog[]> {
    const response = await fetch(`${SERVER_URL}/daily-logs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch daily logs");
    }

    return response.json();
}