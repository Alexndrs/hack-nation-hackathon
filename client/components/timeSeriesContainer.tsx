import { View, Text, TouchableOpacity } from "react-native";
import { useData } from "../hooks/useData";
import { EllipsisIcon } from "lucide-react-native"
import LineChart from "./LineChart";
import { useEffect } from "react";

export default function TimeSeriesContainer() {

    const { timelineData, showTimeSeries, setShowTimeSeries } = useData();
    useEffect(() => {
        console.log("Timeline Data:", timelineData);
    }, [timelineData]);
    return (
        <View className={`absolute left-0 mx-auto w-full h-[100%] bg-neutral-800 border border-white/10 rounded-[40px] p-8
            ${!showTimeSeries ? 'top-[300px]' : '-top-[100%]'} transition-all duration-300 ease-in-out z-1`}
        >
            <Text className="text-gray-700">test</Text>
            <LineChart />
        </View>

    );
};