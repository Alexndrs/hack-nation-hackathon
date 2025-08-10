import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { postWorkout, postTimeSeriesPoints, patchWorkout } from '../api/data';
import { TimeSeriesPoint, Workout } from '../api/types';

// Interface pour l'état du training que les composants vont observer
export interface TrainingState {
    isActive: boolean;
    isPaused: boolean;
    currentWorkout: Workout | null;
    currentSpeed: number | null;
    currentHeartRate: number | null;
    currentDuration: string;
    error: string | null;
}

// Type pour les listeners qui observent les changements
type TrainingStateListener = (state: TrainingState) => void;

class TrainingService {
    private recording: Audio.Recording | undefined;
    private locationSubscription: Location.LocationSubscription | null = null;
    private timerInterval: NodeJS.Timeout | null = null;
    private timeSerie: TimeSeriesPoint[] = [];
    private currentWorkout: Workout | null = null;
    private isPaused: boolean = false;
    private error: string | null = null;

    // Liste des listeners qui observent les changements d'état
    private listeners: TrainingStateListener[] = [];

    private frequency: number = 1000; // Update every second

    // Méthode pour s'abonner aux changements d'état
    subscribe(listener: TrainingStateListener): () => void {
        this.listeners.push(listener);

        // Envoyer l'état actuel immédiatement
        listener(this.getCurrentState());

        // Retourner une fonction de désabonnement
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Méthode privée pour notifier tous les listeners
    private notifyListeners(): void {
        const currentState = this.getCurrentState();
        this.listeners.forEach(listener => listener(currentState));
    }

    // Obtenir l'état actuel
    private getCurrentState(): TrainingState {
        return {
            isActive: this.currentWorkout !== null,
            isPaused: this.isPaused,
            currentWorkout: this.currentWorkout,
            currentSpeed: this.getCurrentSpeed(),
            currentHeartRate: this.getCurrentHeartRate(),
            currentDuration: this.getCurrentDurationFormatted(),
            error: this.error,
        };
    }

    async ensurePermissions(): Promise<boolean> {
        try {
            // Audio
            const audioStatus = await Audio.getPermissionsAsync();
            if (audioStatus.status !== 'granted') {
                const audioRequest = await Audio.requestPermissionsAsync();
                if (audioRequest.status !== 'granted') {
                    this.setError('Permission audio refusée');
                    return false;
                }
            }

            // GPS foreground
            const fgStatus = await Location.getForegroundPermissionsAsync();
            if (fgStatus.status !== 'granted') {
                const fgRequest = await Location.requestForegroundPermissionsAsync();
                if (fgRequest.status !== 'granted') {
                    this.setError('Permission GPS foreground refusée');
                    return false;
                }
            }

            // GPS background
            const bgStatus = await Location.getBackgroundPermissionsAsync();
            if (bgStatus.status !== 'granted') {
                const bgRequest = await Location.requestBackgroundPermissionsAsync();
                if (bgRequest.status !== 'granted') {
                    this.setError('Permission GPS arrière-plan refusée');
                    return false;
                }
            }

            this.clearError();
            return true;
        } catch (error) {
            console.error('Error checking permissions:', error);
            this.setError('Erreur lors de la vérification des permissions');
            return false;
        }
    }

    async startTraining(): Promise<boolean> {

        try {
            this.clearError();

            const hasPermissions = await this.ensurePermissions();
            if (!hasPermissions) return false;

            this.currentWorkout = {
                id: 0, // Placeholder, will be updated after post
                avg_heart_rate: 0,
                avg_speed: 0,
                max_speed: 0,
                duration_seconds: 0,
                start_time: new Date().toISOString(),
            };

            // Notifier que le training commence
            this.notifyListeners();

            const { workout_id } = await postWorkout(this.currentWorkout);
            this.currentWorkout.id = workout_id;

            await this.startAudioRecording();
            await this.startLocationTracking();
            this.startTimer();

            // Notifier que le training a vraiment commencé
            this.notifyListeners();

            
            return true;
        } catch (error) {
            console.error('Error starting training:', error);
            this.setError('Erreur lors du démarrage de l\'entraînement');
            return false;
        }
    }

    async stopTraining(): Promise<void> {
        try {
            if (!this.currentWorkout) return;

            await this.stopAudioRecording();
            this.stopLocationTracking();
            this.stopTimer();

            // Sauvegarder les derniers points s'il y en a
            if (this.timeSerie.length > 0) {
                await postTimeSeriesPoints(this.timeSerie);
                this.timeSerie = [];
            }

            await patchWorkout(this.currentWorkout);

            this.currentWorkout = null;
            this.timeSerie = [];
            this.isPaused = false;
            this.clearError();

            // Notifier que le training s'est arrêté
            this.notifyListeners();
        } catch (error) {
            console.error('Error stopping training:', error);
            this.setError('Erreur lors de l\'arrêt de l\'entraînement');
            this.notifyListeners();
        }
    }

    pauseTraining(): void {
        if (!this.currentWorkout) return;

        this.isPaused = true;
        this.stopTimer();
        this.notifyListeners();
    }

    resumeTraining(): void {
        if (!this.currentWorkout) return;

        this.isPaused = false;
        this.startTimer();
        this.notifyListeners();
    }

    private async startAudioRecording(): Promise<void> {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        this.recording = recording;
    }

    private async stopAudioRecording(): Promise<string | undefined> {
        if (this.recording && this.currentWorkout) {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI() || undefined;
            this.recording = undefined;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            return uri;
        }
    }

    private async startLocationTracking(): Promise<void> {
        this.locationSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: this.frequency,
                distanceInterval: 0,
            },
            (location) => {
                if (this.currentWorkout && !this.isPaused) {
                    const trainingData: TimeSeriesPoint = {
                        workout_id: this.currentWorkout.id,
                        timestamp: Math.floor((Date.now() - new Date(this.currentWorkout.start_time).getTime()) / 1000),
                        heart_rate: this.simulateHeartRate(),
                        speed: location.coords.speed || 0,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };

                    this.timeSerie.push(trainingData);

                    // Notifier les changements de données en temps réel
                    this.notifyListeners();
                }

                if (this.timeSerie.length > 5) { // save every 5 points
                    postTimeSeriesPoints(this.timeSerie).then(() => {
                        this.timeSerie = [];
                    }).catch((error) => {
                        console.error('Error saving time series:', error);
                        this.setError('Erreur lors de la sauvegarde des données');
                    });
                }
            }
        );
    }

    private stopLocationTracking(): void {
        if (this.locationSubscription) {
            this.locationSubscription.remove();
            this.locationSubscription = null;
            console.log("GPS tracking stopped");
        }
    }

    private updateWorkout(): void {
        if (!this.currentWorkout) return;

        const allSpeeds = this.timeSerie.map(point => point.speed).filter(speed => speed > 0);
        const allHeartRates = this.timeSerie.map(point => point.heart_rate).filter(hr => hr !== null) as number[];

        if (allSpeeds.length > 0) {
            this.currentWorkout.avg_speed = allSpeeds.reduce((sum, speed) => sum + speed, 0) / allSpeeds.length;
            this.currentWorkout.max_speed = Math.max(...allSpeeds);
        }

        if (allHeartRates.length > 0) {
            this.currentWorkout.avg_heart_rate = Math.floor(allHeartRates.reduce((sum, hr) => sum + hr, 0) / allHeartRates.length);
        }
    }

    private startTimer(): void {
        if (this.timerInterval) return;

        this.timerInterval = setInterval(() => {
            if (this.currentWorkout && !this.isPaused) {
                const currentTime = Date.now();
                const duration = Math.floor((currentTime - new Date(this.currentWorkout.start_time).getTime()) / 1000);
                this.currentWorkout.duration_seconds = duration;
                this.updateWorkout();

                // Notifier les changements de durée
                this.notifyListeners();
            }
        }, this.frequency);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private getCurrentDuration(): number {
        if (!this.currentWorkout) return 0;

        const currentTime = Date.now();
        const startTime = new Date(this.currentWorkout.start_time).getTime();
        return Math.floor((currentTime - startTime) / 1000);
    }

    private simulateHeartRate(): number {
        return Math.floor(Math.random() * 40) + 130;
    }

    private setError(error: string): void {
        this.error = error;
        this.notifyListeners();
    }

    private clearError(): void {
        this.error = null;
    }

    // Méthodes publiques pour obtenir les données actuelles
    getCurrentWorkout(): Workout | null {
        return this.currentWorkout;
    }

    getCurrentSpeed(): number | null {
        const latestData = this.timeSerie.slice(-1)[0];
        return latestData ? latestData.speed : null;
    }

    getCurrentHeartRate(): number | null {
        const latestData = this.timeSerie.slice(-1)[0];
        return latestData ? latestData.heart_rate : null;
    }

    getCurrentDurationFormatted(): string {
        const duration = this.getCurrentDuration();
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export const trainingService = new TrainingService();