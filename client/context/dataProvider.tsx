// contexts/DataProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { type DailyLog, type Workout, type TimeSeriesPoint } from '../api/types';
import { useData } from '../hooks/useData';

// Type pour le contexte
type DataContextType = {
    dailyLogs: Record<string, DailyLog>;
    fetchDailyLogs: () => Promise<void>;
    addDailyLog: (log: DailyLog) => Promise<void>;
    logByDate: (date: string) => DailyLog | undefined;
    updateDailyLog: (log: DailyLog) => Promise<void>;
    workouts: Record<string, Workout[]>;
    fetchWorkouts: () => Promise<void>;
    workoutsByDate: (date: string) => Workout[];
    setWorkoutTimeSeries: (workoutId: number) => Promise<void>;
    timelineData: TimeSeriesPoint[];
    isLoading: boolean;
    hasFetchedLogs: boolean;
    hasFetchedWorkouts: boolean;
    showTimeSeries: boolean;
    setShowTimeSeries: (show: boolean) => void;
};

// Créer le contexte
const DataContext = createContext<DataContextType | null>(null);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
    const dataValue = useData();

    return (
        <DataContext.Provider value={dataValue}>
            {children}
        </DataContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useDataContext = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};