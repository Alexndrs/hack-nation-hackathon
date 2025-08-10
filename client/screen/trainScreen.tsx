import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeOff } from "lucide-react-native"
//import BackgroundTimer from 'react-native-background-timer';
import { useTraining } from '../hooks/useTraining';


export default function TrainScreen() {
    const [mute, setMute] = useState(false);

    const {
        // For user feedback
        isActive,
        isPaused,
        currentWorkout,
        currentSpeed,
        currentHeartRate,
        currentDuration,
        error,
        isLoading,

        // Logic
        startTraining,
        stopTraining,
        pauseTraining,
        resumeTraining,
    } = useTraining();


    const handleTrainingButton = async () => {
        if (!isActive) {
            // Démarrer l'entraînement
            const success = await startTraining();
            if (!success && error) {
                Alert.alert(
                    'Erreur',
                    error || 'Impossible de démarrer l\'entraînement'
                );
            }
        } else {
            // Arrêter l'entraînement
            Alert.alert(
                'Arrêter l\'entraînement',
                'Êtes-vous sûr de vouloir arrêter cette session ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Arrêter', style: 'destructive', onPress: stopTraining },
                ]
            );
        }
    };

    const handlePauseResume = () => {
        if (isPaused) {
            resumeTraining();
        } else {
            pauseTraining();
        }
    };

    const handleMute = () => {
        setMute(!mute);
    };



    return (
        <View style={styles.container}>
            {/* Afficher les erreurs si nécessaire */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}

            {/* Stats pendant l'entraînement */}
            {isActive && (
                <View style={styles.statsContainer}>
                    {/* Speed Display */}
                    <Text style={styles.speedText}>
                        🏃‍♂️ {currentSpeed ? currentSpeed.toFixed(1) : '0.0'} km/h
                    </Text>

                    {/* Heart Rate Display */}
                    {currentHeartRate !== null && (
                        <Text style={styles.heartRateText}>
                            ❤️ {currentHeartRate} bpm
                        </Text>
                    )}

                    {/* Duration Display */}
                    <Text style={styles.durationText}>
                        ⏱️ {currentDuration}
                    </Text>

                    {/* Workout Stats */}
                    {currentWorkout && (
                        <View style={styles.workoutStats}>
                            <Text style={styles.statText}>
                                Vitesse moy: {currentWorkout.avg_speed.toFixed(1)} km/h
                            </Text>
                            <Text style={styles.statText}>
                                Vitesse max: {currentWorkout.max_speed.toFixed(1)} km/h
                            </Text>
                            {currentWorkout.avg_heart_rate > 0 && (
                                <Text style={styles.statText}>
                                    FC moy: {currentWorkout.avg_heart_rate} bpm
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Pause Status */}
                    {isPaused && (
                        <Text style={styles.pausedText}>
                            ⏸️ EN PAUSE
                        </Text>
                    )}

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={handlePauseResume}
                            disabled={isLoading}
                        >
                            {isPaused ? (
                                <PlayIcon size={24} color="white" />
                            ) : (
                                <PauseIcon size={24} color="white" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.controlButton}
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

            {/* Start / Stop Button */}
            <TouchableOpacity
                style={[
                    styles.trainingButton,
                    isActive ? styles.stopButton : styles.startButton,
                ]}
                onPress={handleTrainingButton}
                disabled={isLoading}
            >
                <Text
                    style={[
                        styles.trainingButtonText,
                        isActive ? styles.stopButtonText : styles.startButtonText,
                    ]}
                >
                    {isLoading
                        ? 'Chargement...'
                        : isActive
                            ? 'Arrêter l\'entraînement'
                            : 'Commencer l\'entraînement'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorContainer: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        fontWeight: '600',
    },
    statsContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    speedText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    heartRateText: {
        fontSize: 28,
        color: 'red',
        fontWeight: '600',
        marginBottom: 10,
    },
    durationText: {
        fontSize: 24,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 10,
    },
    workoutStats: {
        alignItems: 'center',
        marginVertical: 15,
    },
    statText: {
        fontSize: 14,
        color: '#B0B0B0',
        marginVertical: 2,
    },
    pausedText: {
        fontSize: 18,
        color: '#FFA726',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    controlsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 20,
    },
    controlButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
    },
    trainingButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        minWidth: 200,
    },
    startButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    stopButton: {
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
    },
    trainingButtonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    startButtonText: {
        color: '#4CAF50',
    },
    stopButtonText: {
        color: '#F44336',
    },
});
