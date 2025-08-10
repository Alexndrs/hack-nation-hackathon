import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import LineChart from "./LineChart";
import { type Workout } from "../api/types";
import { useDataContext } from "../context/dataProvider";
import { EllipsisIcon } from "lucide-react-native"

export default function Workouts({ workouts }: {
    workouts: Workout[];
}) {

    const { setWorkoutTimeSeries, setShowTimeSeries } = useDataContext();

    const duration_h_min_s = (duration_seconds: number) => {
        const hours = Math.floor(duration_seconds / 3600);
        const minutes = Math.floor((duration_seconds % 3600) / 60);
        const seconds = duration_seconds % 60;
        return { hours, minutes, seconds };
    };

    const avg_speed_km_h = (avg_speed: number) => {
        return (avg_speed * 3.6).toFixed(1);
    }


    return (
        <View className="mx-auto w-[90%] mt-5">
            <Text className="text-gray-300">Workout</Text>

            {workouts.map((workout) => {
                const date = new Date(workout.start_time);
                const time = date.toTimeString().split(' ')[0];
                // time 12h12 format
                const formattedTime = time.split(':').slice(0, 2).join(':');


                return (
                    <View key={workout.id} className="w-full bg-white/10 rounded-lg mb-2 pl-4 py-2 pr-2 flex flex-row gap-5 items-center">
                        <Text className="text-gray-400 flex flex-row">
                            {formattedTime}
                            <Text className="text-gray-500 text-xs ml-2">
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>

                        </Text>
                        <Text className="text-gray-400 flex flex-row">{workout.avg_heart_rate}
                            <Text className="text-gray-500 text-xs ml-2">
                                bpm
                            </Text>
                        </Text>
                        <Text className="text-gray-400 flex flex-row">{avg_speed_km_h(workout.avg_speed)}
                            <Text className="text-gray-500 text-xs ml-2">km/h</Text></Text>
                        <Text className="text-gray-400 flex flex-row">
                            {duration_h_min_s(workout.duration_seconds).hours}
                            <Text className="text-gray-500 text-xs ml-2">h</Text>
                            {String(duration_h_min_s(workout.duration_seconds).minutes).padStart(2, '0')}
                            <Text className="text-gray-500 text-xs ml-2">m</Text>
                            {String(duration_h_min_s(workout.duration_seconds).seconds).padStart(2, '0')}
                            <Text className="text-gray-500 text-xs ml-2">s</Text>
                        </Text>
                        <TouchableOpacity
                            className="ml-auto bg-white/10 border border-white/10 rounded"
                            onPress={() => {
                                setWorkoutTimeSeries(workout.id);
                                setShowTimeSeries(true);
                            }}>
                            <EllipsisIcon size={20} color="rgba(255,255,255,0.40)" />
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>

    );
};