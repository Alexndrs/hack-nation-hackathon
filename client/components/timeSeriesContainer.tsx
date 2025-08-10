import { View, Text, TouchableOpacity } from "react-native";
import { useData } from "../hooks/useData";
import { EllipsisIcon } from "lucide-react-native"
import LineChart from "./LineChart";
import { XIcon } from 'lucide-react-native'
import { useDataContext } from "../context/dataProvider";

export default function TimeSeriesContainer() {

    const { timelineData, showTimeSeries, setShowTimeSeries } = useDataContext();

    console.log("showTimeSeries", showTimeSeries)
    return (
        <View className={`absolute left-0 mx-auto w-full h-[100%] bg-neutral-800 border border-white/10 rounded-[40px] p-8
            ${showTimeSeries ? 'top-[225px]' : '-top-[100%]'} transition-all duration-300 ease-in-out z-1`}
        >
            <TouchableOpacity
                className="absolute top-4 right-4"
                onPress={() => setShowTimeSeries(false)}
            >
                <XIcon size={24} color="rgba(255,255,255,0.40)" />
            </TouchableOpacity>


            <Text className="text-gray-400 font-bold">Charts</Text>
            <LineChart />
        </View>

    );
};