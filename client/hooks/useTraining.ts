import { useState, useEffect } from 'react';
import { trainingService, TrainingState } from '../service/training';
import { useConversation } from '@elevenlabs/react-native';

export const useTraining = () => {
    // État local qui reflète l'état du service
    const startPrompt: string = "I am starting a running session. Be careful to the context I am going to send you information about my speed and my heartrate. If either of those get out of bounds, tell me so that I can adapt my speed."
    const tooHighHrContext: string = "The heart rate of the runner is too high. Please let them know and ask them to slow down as soon as possible."
    const tooHighSpeedContext: string = "The runner has a too high pace. Please let them know and ask them to slow down as soon as possible."
    const tooSlowSpeedContext: string = "The runner has a too slow pace. Please let them know and ask them to accelerate as soon as possible."
    const backToNormalContext: string = "The runner is back to normal values. Forget earlier context in which they were not in the right speed range and heart rate range, and congratulate them on their good run."

    const maxHr: number = 165
    const minSpeed: number = 8
    const maxSpeed: number = 12

    let updateContextInterval: NodeJS.Timeout | null = null;

    const [trainingState, setTrainingState] = useState<TrainingState>({
        isActive: false,
        isPaused: false,
        isConnected: false,
        currentWorkout: null,
        currentSpeed: null,
        currentHeartRate: null,
        currentDuration: '00:00',
        error: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected to conversation')
            setTrainingState(prevState => ({ ...prevState, isConnected: true }));
        },
        onDisconnect: () => {
            console.log('Disconnected from conversation')
            setTrainingState(prevState => ({ ...prevState, isConnected: false }));
        },
        onMessage: (message) => console.log('Received message:', message),
        onError: (error) => console.error('Conversation error:', error),
        onModeChange: (mode) => console.log('Conversation mode changed:', mode),
        onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
        onCanSendFeedbackChange: (prop) => console.log('Can send feedback changed:', prop.canSendFeedback),
        onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
    });

    // S'abonner aux changements du service
    useEffect(() => {
        const unsubscribe = trainingService.subscribe((newState: TrainingState) => {
            setTrainingState(newState);
        });

        // Nettoyer l'abonnement quand le composant est démonté
        return unsubscribe;
    }, []);

    const startConversation = async () => {
        try {
            await conversation.startSession({
                agentId: 'agent_3601k281n3v2ef3b66nat7yn05aa&conversation_signature=cvtkn_2201k288fz5sezp9v6tc9ttsq955',
            });
            return true
        } catch (e) {
            return false
        }
    };

    const endConversation = async () => {
        await conversation.endSession();
    };

    // const sendMessage = async (msg: string): Promise<boolean> => {
    //     // Avoid multiple intervals
    //if (!sendInterval){

    //sendInterval = setInterval(async () => {

    const startUpdateContextLoop = () => {
        if (updateContextInterval) return; // Avoid multiple intervals
        updateContextInterval = setInterval(() => {
            updateContext();
        }, 20000); // 20s
    };

    const stopUpdateContextLoop = () => {
        if (updateContextInterval) {
            clearInterval(updateContextInterval);
            updateContextInterval = null;
        }
    };

    const updateContext = async () => {
        const speed = trainingService.getCurrentSpeed();
        const heartRate = trainingService.getCurrentHeartRate();
        let prompt = "";

        if (speed !== null && speed < minSpeed) {
            prompt = tooSlowSpeedContext;
        } else if (speed !== null && speed > maxSpeed) {
            prompt = tooHighSpeedContext;
        } else if (heartRate !== null && heartRate > maxHr) {
            prompt = tooHighHrContext;
        }

        if (prompt) {
            try {
                await sendContextualUpdate(prompt);
                console.log("Sent prompt:", prompt);
            } catch (error) {
                console.error("Failed to send prompt:", error);
            }
        }
    };

    const sendMessage = async (msg: string): Promise<boolean> => {
        try {
            await conversation.sendUserMessage(msg);
            return true;
        } catch (error) {
            return false;
        }
    };


    const sendContextualUpdate = async (context: string): Promise<boolean> => {
        try {
            await conversation.sendContextualUpdate(context);
            return true
        } catch (error) {
            return false
        }
    };

    const startTraining = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            let success = await trainingService.startTraining();
            success = success && await startConversation();

            // Envoie du contexte toutes les 20 s
            startUpdateContextLoop(); // <-- no await here
            return success;
        } finally {
            setIsLoading(false);
        }
    };

    const stopTraining = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const success = await trainingService.stopTraining();
            await endConversation();
            stopUpdateContextLoop();
            return success;
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
        isConnected: trainingState.isConnected,
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