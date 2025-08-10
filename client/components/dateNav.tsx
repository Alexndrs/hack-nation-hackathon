import { View, Text, TouchableOpacity } from "react-native";
import { Triangle } from "lucide-react-native"


export default function DateNav({ handlePreviousDay, handleNextDay, date }: {
    handlePreviousDay: () => void;
    handleNextDay: () => void;
    date: Date;
}) {
    return (
        <View className="flex flex-row items-center mt-20">
            <TouchableOpacity className="-rotate-90 p-5" onPress={handlePreviousDay}>
                <Triangle size={25} color="rgba(255,255,255,0.2)" />
            </TouchableOpacity>

            <Text className="text-gray-300 text-lg px-8 py-4 rounded-full bg-white/10 border border-white/10">
                {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                })}
            </Text>

            <TouchableOpacity className="rotate-90 p-5" onPress={handleNextDay}>
                <Triangle size={25} color="rgba(255,255,255,0.2)" />
            </TouchableOpacity>
        </View>
    )
}