import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { type DailyLog } from "../api/types";
import InputField from "./inputField";
import { PlusIcon, PencilIcon } from 'lucide-react-native'

export default function DailyLogForm({ date, existingLog, onSave }: {
    date: Date;
    existingLog?: DailyLog;
    onSave: (log: DailyLog, isUpdate: boolean) => Promise<void>;
}) {

    const dateString = date.toISOString().split('T')[0];
    const id = date.getTime();
    const isUpdate = !!existingLog;

    const [displayValues, setDisplayValues] = useState({
        sleep_seconds: existingLog?.sleep_seconds?.toString() || '', // Pas de conversion, garde la valeur telle quelle
        calories: existingLog?.calories?.toString() || '',
        weight_kg: existingLog?.weight_kg?.toString() || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setDisplayValues({
            sleep_seconds: existingLog?.sleep_seconds?.toString() || '', // Pas de conversion ici non plus
            calories: existingLog?.calories?.toString() || '',
            weight_kg: existingLog?.weight_kg?.toString() || '',
        });
    }, [dateString, existingLog]);

    const handleChange = (field: keyof typeof displayValues, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setDisplayValues(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const getNumericValues = (): DailyLog => {
        return {
            id,
            date: dateString,
            sleep_seconds: displayValues.sleep_seconds === '' ? 0 : Number(displayValues.sleep_seconds),
            calories: displayValues.calories === '' ? 0 : Number(displayValues.calories),
            weight_kg: displayValues.weight_kg === '' ? 0 : Number(displayValues.weight_kg),
        };
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = getNumericValues();
            await onSave(formData, isUpdate);
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="w-full mt-5 max-w-sm mx-auto">
            <View className="bg-white/10 border border-white/10 rounded-xl p-2">
                <View className="flex flex-row items-end">
                    <InputField
                        label="Sleep"
                        value={displayValues.sleep_seconds}
                        onChange={(value) => handleChange('sleep_seconds', value)}
                        placeholder="8.5h"
                    />

                    <InputField
                        label="Kcal"
                        value={displayValues.calories}
                        onChange={(value) => handleChange('calories', value)}
                        placeholder="2000"
                    />

                    <InputField
                        label="Weight"
                        value={displayValues.weight_kg}
                        onChange={(value) => handleChange('weight_kg', value)}
                        placeholder="70.5kg"
                    />
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className={`ml-4 p-3 rounded-lg ${isSubmitting
                            ? 'bg-gray-600'
                            : isUpdate
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                            }`}
                    >
                        {isSubmitting ? (
                            <View className="flex-row items-center justify-center">
                                <ActivityIndicator size="small" color="white" />
                            </View>
                        ) : (
                            <View className="text-white font-medium text-center">
                                {isUpdate ? (
                                    <PencilIcon size={20} color="white" />

                                ) : (
                                    <PlusIcon size={20} color="white" />
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};