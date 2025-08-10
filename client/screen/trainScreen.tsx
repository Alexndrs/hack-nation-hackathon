import { useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeOff } from "lucide-react-native"
import { Audio } from 'expo-av';
import * as Location from "expo-location";

export default function TrainScreen() {
    const [trainingStarted, setTrainingStarted] = useState(false);
    const [mute, setMute] = useState(false);
    const [pause, setPause] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const locationWatcher = useRef<Location.LocationSubscription | null>(null);


    async function ensurePermissions() {
        // Permission audio
        if (!permissionResponse || permissionResponse.status !== "granted") {
            const audioPerm = await requestPermission();
            if (audioPerm.status !== "granted") {
                console.warn("Permission audio refusée");
                return false;
            }
        }

        let fgStatus = await Location.getForegroundPermissionsAsync();
        if (fgStatus.status !== "granted") {
            const fgPerm = await Location.requestForegroundPermissionsAsync();
            if (fgPerm.status !== "granted") {
                console.warn("Permission GPS foreground refusée");
                return false;
            }
        }


        let bgStatus = await Location.getBackgroundPermissionsAsync();
        if (bgStatus.status !== "granted") {
            const bgPerm = await Location.requestBackgroundPermissionsAsync();
            if (bgPerm.status !== "granted") {
                console.warn("Permission GPS arrière-plan refusée");
                return false;
            }
        }

        return true;
    }


    async function startRecording() {
        try {
            const ok = await ensurePermissions();
            if (!ok) return;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');

            locationWatcher.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000, // save every 2 seconds
                    distanceInterval: 0
                },
                (location) => {
                    console.log("Location received :", location.coords);
                    // Save in state and send
                }
            );
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        if (recording) {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);
            setRecording(undefined);
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            // Ici tu peux uploader ou traiter le fichier audio uri si besoin
        } else {
            console.warn('No recording in progress to stop.');
        }

        if (locationWatcher.current) {
            locationWatcher.current.remove();
            locationWatcher.current = null;
            console.log("Tracking GPS arrêté");
        }
    }

    const handleTrainingBtn = async () => {
        if (!trainingStarted) {
            // Si la session ne tourne pas encore, on démarre l'enregistrement
            await startRecording();
        } else {
            // Sinon on arrête l'enregistrement
            await stopRecording();
        }
        setTrainingStarted(!trainingStarted);
    };

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