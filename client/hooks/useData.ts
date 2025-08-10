import { useState } from 'react';
import { type DailyLog } from '../api/types';
import { getDailyLogs, postDailyLog, patchDailyLog } from '../api/data';


export const useData = () => {
    const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);


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


    return {
        dailyLogs,
        fetchDailyLogs,
        addDailyLog,
        logByDate,
        updateDailyLog,
        isLoading,
        hasFetched
    };
}