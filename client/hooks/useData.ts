import { useState } from 'react';
import { type DailyLog, type Workout, type TimeSeriesPoint } from '../api/types';
import { getDailyLogs, postDailyLog, patchDailyLog, getWorkouts, getWorkoutTimeSeries } from '../api/data';


export const useData = () => {
    const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});


    const fetchDailyLogs = async () => {
        if (hasFetched) return;

        setIsLoading(true);
        try {
            const logs = await getDailyLogs();
            const logsByDate: Record<string, DailyLog> = {};
            logs.forEach(log => {
                logsByDate[log.date] = log;
            });
            setDailyLogs(logsByDate);
            setHasFetched(true);

        } catch (error) {
            console.error("Failed to fetch daily logs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchWorkouts = async () => {
        setIsLoading(true);
        try {
            const workouts = await getWorkouts();
            const workoutsByDate: Record<string, Workout[]> = {};
            workouts.forEach(workout => {
                if (!workoutsByDate[workout.start_time]) {
                    workoutsByDate[workout.start_time] = [];
                }
                workoutsByDate[workout.start_time].push(workout);
            });
            setWorkouts(workoutsByDate);
            setHasFetched(true);
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

    const getWorkoutsByDate = (date: string): Workout[] => {
        return workouts[date] || [];
    }

    const getWorkoutTimeSeries = async (workoutId: number): Promise<TimeSeriesPoint[]> => {
        try {
            const timeSeries = await getWorkoutTimeSeries(workoutId);
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
        getWorkoutsByDate,
        getWorkoutTimeSeries,
        isLoading,
        hasFetched
    };
}