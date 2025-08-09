import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeOff } from "lucide-react-native"


export default function TrainScreen() {
    const [trainingStarted, setTrainingStarted] = useState(false);
    const [mute, setMute] = useState(false);
    const [pause, setPause] = useState(false);

    const handleTrainingBtn = () => {
        // Logic to start or stop the training
        setTrainingStarted(!trainingStarted);
    }

    const handleMute = () => {
        // Logic to mute the training sounds
        setMute(!mute);
    }

    const handlePause = () => {
        // Logic to pause the training
        setPause(!pause);
    }

    return (
        <View className="flex-1 items-center justify-center">

            {trainingStarted && <View className="flex flex-row gap-2 mb-2">
                <TouchableOpacity className="p-2 border border-white/10 bg-white/10 rounded-md" onPress={handlePause} >
                    {pause ? <PlayIcon size={24} color="white" /> : <PauseIcon size={24} color="white" />}
                </TouchableOpacity>
                <TouchableOpacity className="p-2 border border-white/10 bg-white/10 rounded-md" onPress={handleMute}>
                    {mute ? <VolumeOff size={24} color="white" /> : <Volume2Icon size={24} color="white" />}
                </TouchableOpacity>
            </View>}
            <TouchableOpacity
                className={`px-8 py-4 rounded-full border border-white/10 ${!trainingStarted ? 'bg-white/10' : 'bg-red-800/30'}`}
                onPress={handleTrainingBtn}
                style={{
                    minWidth: 120,
                }}
            >
                <Text className={`text-center font-semibold text-base ${trainingStarted ? 'text-red-300' : 'text-gray-300'}`}>
                    {trainingStarted ? 'Stop training' : 'Start Training'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}