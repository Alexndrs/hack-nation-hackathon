import { useState } from "react";
import { Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { postDailyLog } from "../api/data";
import { type DailyLog } from "../api/types";

export default function DailyLogForm({ date }: { date: Date }) {
    const [dailyLog, setDailyLog] = useState<DailyLog>({
        date: date.toISOString().split("T")[0],
        sleep_seconds: 0,
        calories: 0,
        weight_kg: 0,
    });

    const handleChange = (field: keyof DailyLog, value: string) => {
        setDailyLog((prev) => ({
            ...prev,
            [field]: field === "date" ? value : Number(value),
        }));
    };

    const handleSave = async () => {
        try {
            await postDailyLog(dailyLog);
            Alert.alert("Succès", "Daily log saved successfully");
        } catch (error) {
            console.error("Failed to save daily log:", error);
            Alert.alert("Erreur", "Impossible de sauvegarder le daily log");
        }
    };

    return (
        <ScrollView className="p-6 w-full">
            <Text className="text-white text-2xl font-bold mb-6 text-center">Daily Log</Text>

            {/* Sleep */}
            <Text className="text-gray-300 mb-1">Sleep (seconds)</Text>
            <TextInput
                value={dailyLog.sleep_seconds.toString()}
                onChangeText={(text) => handleChange("sleep_seconds", text)}
                keyboardType="numeric"
                placeholder="e.g. 28800"
                placeholderTextColor="#888"
                className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
            />

            {/* Calories */}
            <Text className="text-gray-300 mb-1">Calories</Text>
            <TextInput
                value={dailyLog.calories.toString()}
                onChangeText={(text) => handleChange("calories", text)}
                keyboardType="numeric"
                placeholder="e.g. 2000"
                placeholderTextColor="#888"
                className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
            />

            {/* Weight */}
            <Text className="text-gray-300 mb-1">Weight (kg)</Text>
            <TextInput
                value={dailyLog.weight_kg.toString()}
                onChangeText={(text) => handleChange("weight_kg", text)}
                keyboardType="numeric"
                placeholder="e.g. 70"
                placeholderTextColor="#888"
                className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
            />

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} className="bg-blue-500 py-3 rounded">
                <Text className="text-white text-center font-semibold">Save Daily Log</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
