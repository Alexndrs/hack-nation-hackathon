import { useState, useEffect } from 'react';
import { trainingService, TrainingState } from '../service/training';

export const useTraining = () => {
    // État local qui reflète l'état du service
    const [trainingState, setTrainingState] = useState<TrainingState>({
        isActive: false,
        isPaused: false,
        currentWorkout: null,
        currentSpeed: null,
        currentHeartRate: null,
        currentDuration: '00:00',
        error: null,
    });

    const [isLoading, setIsLoading] = useState(false);

    // S'abonner aux changements du service
    useEffect(() => {
        const unsubscribe = trainingService.subscribe((newState: TrainingState) => {
            setTrainingState(newState);
        });

        // Nettoyer l'abonnement quand le composant est démonté
        return unsubscribe;
    }, []);

    const startTraining = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            const success = await trainingService.startTraining();
            return success;
        } finally {
            setIsLoading(false);
        }
    };

    const stopTraining = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await trainingService.stopTraining();
        } finally {
            setIsLoading(false);
        }
    };

    const pauseTraining = (): void => {
        trainingService.pauseTraining();
    };

    const resumeTraining = (): void => {
        trainingService.resumeTraining();
    };

    // Retourner l'état et les actions
    return {
        // État du training
        isActive: trainingState.isActive,
        isPaused: trainingState.isPaused,
        currentWorkout: trainingState.currentWorkout,
        currentSpeed: trainingState.currentSpeed,
        currentHeartRate: trainingState.currentHeartRate,
        currentDuration: trainingState.currentDuration,
        error: trainingState.error,

        // État de chargement
        isLoading,

        // Actions
        startTraining,
        stopTraining,
        pauseTraining,
        resumeTraining,
    };
};

// Hook optionnel pour n'obtenir que l'état sans les actions
export const useTrainingState = (): TrainingState => {
    const [trainingState, setTrainingState] = useState<TrainingState>({
        isActive: false,
        isPaused: false,
        currentWorkout: null,
        currentSpeed: null,
        currentHeartRate: null,
        currentDuration: '00:00',
        error: null,
    });

    useEffect(() => {
        const unsubscribe = trainingService.subscribe(setTrainingState);
        return unsubscribe;
    }, []);

    return trainingState;
};