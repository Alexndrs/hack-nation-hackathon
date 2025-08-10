import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import LineChart from "./LineChart";


export default function Workouts({ }: {

}) {


    return (
        <View className="w-full mx-auto items-center">
            <Text className="text-gray-300">Workout</Text>
            <LineChart />
        </View>

    );
};