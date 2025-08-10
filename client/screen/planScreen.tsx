import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

import DateNav from "../components/dateNav";
import DailyLogForm from "../components/dailyLogForm";
import Workouts from "../components/workouts";
import { useData } from "../hooks/useData";
import { DailyLog } from "../api/types";


export default function PlanScreen() {

    const [date, setDate] = useState(new Date());
    const {
        fetchDailyLogs,
        addDailyLog,
        updateDailyLog,
        logByDate,
        isLoading,
        fetchWorkouts,
        workoutsByDate,
        hasFetchedLogs,
        hasFetchedWorkouts,
    } = useData();

    useEffect(() => {
        fetchDailyLogs();
        fetchWorkouts();
    }, []);



    const handlePreviousDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
    }

    const handleNextDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
    }

    const handleSave = async (log: DailyLog, isUpdate: boolean) => {
        if (isUpdate) {
            await updateDailyLog(log);
        } else {
            await addDailyLog(log);
        }
    };

    const dateString = date.toISOString().split('T')[0];
    const existingLog = logByDate(dateString);

    const workouts = workoutsByDate(dateString);


    if (isLoading && (!hasFetchedLogs || !hasFetchedWorkouts)) {
        return (
            <View className="flex-1 items-center justify-center">
                <View className="items-center">
                    <ActivityIndicator size="large" color="white" />
                    <Text className="text-white text-lg mt-4">Loading data...</Text>
                </View>
            </View>
        );
    }



    return (
        <View className="flex-1 items-center ">
            <DateNav
                handlePreviousDay={handlePreviousDay}
                handleNextDay={handleNextDay}
                date={date}
            />
            <DailyLogForm
                date={date}
                existingLog={existingLog}
                onSave={handleSave}
            />
            <Workouts workouts={workouts} />
        </View>
    );
}