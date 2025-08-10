import { useState } from 'react';
import { type DailyLog, type Workout, type TimeSeriesPoint } from '../api/types';
import { getDailyLogs, postDailyLog, patchDailyLog, getWorkouts, getWorkoutTimeSeries as getWorkoutTimeSeriesAPI } from '../api/data';


export const useData = () => {
    const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetchedLogs, setHasFetchedLogs] = useState(false);
    const [hasFetchedWorkouts, setHasFetchedWorkouts] = useState(false);
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});


    const fetchDailyLogs = async () => {
        if (hasFetchedLogs) return;

        setIsLoading(true);
        try {
            const logs = await getDailyLogs();
            const logsByDate: Record<string, DailyLog> = {};
            logs.forEach(log => {
                logsByDate[log.date] = log;
            });
            setDailyLogs(logsByDate);
            setHasFetchedLogs(true);

        } catch (error) {
            console.error("Failed to fetch daily logs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchWorkouts = async () => {
        if (hasFetchedWorkouts) return;

        setIsLoading(true);
        try {
            const workouts = await getWorkouts();
            const workoutsByDate: Record<string, Workout[]> = {};
            workouts.forEach(workout => {
                const date = new Date(workout.start_time);
                const formattedDate = date.toISOString().split('T')[0];
                if (!workoutsByDate[formattedDate]) {
                    workoutsByDate[formattedDate] = [];
                }
                workoutsByDate[formattedDate].push(workout);
            });
            setWorkouts(workoutsByDate);
            setHasFetchedWorkouts(true);
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        } finally {
            setIsLoading(false);
        }
    }


    const addDailyLog = async (log: DailyLog): Promise<void> => {
        try {
            await postDailyLog(log);
            setDailyLogs(prevLogs => ({
                ...prevLogs,
                [log.date]: log
            }));
        } catch (error) {
            console.error("Failed to add daily log:", error);
            throw error;
        }
    }

    const logByDate = (date: string): DailyLog | undefined => {
        return dailyLogs[date];
    }

    const updateDailyLog = async (log: DailyLog): Promise<void> => {
        try {
            await patchDailyLog(log);
            setDailyLogs(prevLogs => ({
                ...prevLogs,
                [log.date]: log
            }));
        } catch (error) {
            console.error("Failed to update daily log:", error);
        }
    }

    const workoutsByDate = (date: string): Workout[] => {
        console.log("Fetching workouts for date:", date);
        if (!workouts[date]) {
            console.warn(`No workouts found for date: ${date}`);
            return [];
        }
        console.log("Workouts found:", workouts[date]);


        return workouts[date] || [];
    }

    const getWorkoutTimeSeries = async (workoutId: number): Promise<TimeSeriesPoint[]> => {
        try {
            const timeSeries = await getWorkoutTimeSeriesAPI(workoutId);
            console.log("Fetched time series for workout ID:", workoutId, timeSeries);
            return timeSeries;
        } catch (error) {
            console.error("Failed to fetch workout time series:", error);
            throw error;
        }
    }

    return {
        dailyLogs,
        fetchDailyLogs,
        addDailyLog,
        logByDate,
        updateDailyLog,
        workouts,
        fetchWorkouts,
        workoutsByDate,
        getWorkoutTimeSeries,
        isLoading,
        hasFetchedLogs,
        hasFetchedWorkouts
    };
}