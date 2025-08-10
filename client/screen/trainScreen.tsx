import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeOff } from "lucide-react-native"
//import BackgroundTimer from 'react-native-background-timer';
import { Audio } from 'expo-av';
import * as Location from "expo-location";


export default function TrainScreen() {
    const [trainingStarted, setTrainingStarted] = useState(false);
    const [mute, setMute] = useState(false);
    const [pause, setPause] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [permissionResponse, requestPermission] = Audio.usePermissions();


    const [speed, setSpeed] = useState<number | null>(0);
    const [heartRate, setHeartRate] = useState<number | null>(150);
    const [seconds, setSeconds] = useState<number>(0)
    const locationWatcher = useRef<Location.LocationSubscription | null>(null);
    let heartRateInterval: NodeJS.Timeout;
    // useEffect(() => {
    //     if (trainingStarted && !pause) {
    //         BackgroundTimer.runBackgroundTimer(() => {
    //             setSeconds(prev => prev + 0.1);
    //         }, 100)
    //     } else {
    //         BackgroundTimer.stopBackgroundTimer()
    //     }
    //     return () => {
    //         BackgroundTimer.stopBackgroundTimer(); // Cleanup on unmount or running change
    //     };
    // }, [trainingStarted, pause]);


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
                    setSpeed(location.coords.speed);
                    console.log("Speed received :", location.coords.speed);
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
            {trainingStarted && (
            <View className="items-center mb-6">
                {/* Speed Display */}
                <Text style={styles.speedText}>
                    🏃‍♂️ {speed ? speed.toFixed(1) : 0} km/h
                </Text>

                {/* Heart Rate Display */}
                {heartRate !== null && (
                <Text style={styles.heartRateText}>
                    ❤️ {heartRate} bpm
                </Text>
                )}

                {/* Stopwatch Display */}
                {trainingStarted && (
                <Text style={styles.heartRateText}>
                    {seconds}
                </Text>
                )}

                {/* Pause / Mute Controls */}
                <View className="flex flex-row gap-4 mt-4">
                <TouchableOpacity
                    className="p-3 border border-white/10 bg-white/10 rounded-md"
                    onPress={handlePause}
                >
                    {pause ? (
                    <PlayIcon size={24} color="white" />
                    ) : (
                    <PauseIcon size={24} color="white" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="p-3 border border-white/10 bg-white/10 rounded-md"
                    onPress={handleMute}
                >
                    {mute ? (
                    <VolumeOff size={24} color="white" />
                    ) : (
                    <Volume2Icon size={24} color="white" />
                    )}
                </TouchableOpacity>
                </View>
            </View>
            )}

            {/* Start / Stop Training Button */}
            <TouchableOpacity
            className={`px-8 py-4 rounded-full border border-white/10 ${
                !trainingStarted ? "bg-white/10" : "bg-red-800/30"
            }`}
            onPress={handleTrainingBtn}
            style={{ minWidth: 120 }}
            >
            <Text
                className={`text-center font-semibold text-base ${
                trainingStarted ? "text-red-300" : "text-gray-300"
                }`}
            >
                {trainingStarted ? "Stop training" : "Start Training"}
            </Text>
            </TouchableOpacity>
        </View>
        );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  heartRateText: {
    fontSize: 28,
    color: "red",
    fontWeight: "600",
    marginBottom: 20,
  },
});