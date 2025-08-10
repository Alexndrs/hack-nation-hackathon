import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LineChart from "./LineChart";
import { type Workout } from "../api/types";
import { useData } from "../hooks/useData";
import { EllipsisIcon } from "lucide-react-native"

export default function Workouts({ workouts }: {
    workouts: Workout[];
}) {

    const { getWorkoutTimeSeries } = useData();

    const duration_h_min = (duration_seconds: number) => {
        const hours = Math.floor(duration_seconds / 3600);
        const minutes = Math.floor((duration_seconds % 3600) / 60);
        return `${hours}h ${minutes}min`;
    };

    const avg_speed_km_h = (avg_speed: number) => {
        return (avg_speed * 3.6).toFixed(1);
    }


    return (
        <View className="mx-auto w-[85%]">
            <Text className="text-gray-300">Workout</Text>

            {workouts.map((workout) => {

                const date = new Date(workout.start_time);
                const time = date.toTimeString().split(' ')[0];


                return (
                    <View key={workout.id} className="w-full bg-white/10 rounded-lg mb-2 pl-4 py-2 pr-2 flex flex-row gap-5 items-center">
                        <Text className="text-white">{time}</Text>
                        <Text className="text-gray-400">{workout.duration_seconds}</Text>
                        <Text className="text-gray-400">{workout.avg_heart_rate}</Text>
                        <Text className="text-gray-400">{avg_speed_km_h(workout.avg_speed)}</Text>
                        <Text className="text-gray-400">{duration_h_min(workout.duration_seconds)}</Text>
                        <TouchableOpacity
                            className="ml-auto bg-white/10 border border-white/10 rounded"
                            onPress={() => getWorkoutTimeSeries(workout.id)}>
                            <EllipsisIcon size={20} color="rgba(255,255,255,0.40)" />
                        </TouchableOpacity>

                    </View>
                );
            })}

            {/* <LineChart /> */}
        </View>

    );
};