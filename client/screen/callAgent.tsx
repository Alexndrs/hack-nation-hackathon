import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
//import { Conversation, Callbacks, Role, Mode, Status } from "@elevenlabs/client";
import { useConversation } from '@elevenlabs/react-native';
import { Audio } from 'expo-av';


export default function CallAgentScreen() {
  //const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

    async function startRecording() {
        try {
        if (!permissionResponse || permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
        console.warn('Permission denied');
        return;
        }
        }
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
    }

    const startConversation = async () => {
        await conversation.startSession({
            agentId: 'agent_3601k281n3v2ef3b66nat7yn05aa&conversation_signature=cvtkn_2201k288fz5sezp9v6tc9ttsq955',
        });
    };

    const endConversation = async () => {
        await conversation.endSession();
        stopRecording();
    };

    const sendMessage = async () => {
        await conversation.sendUserMessage('Hello, how can you help me?');
    };

  //function ConversationComponent() {
    startRecording();
    const conversation = useConversation({
        onConnect: () => console.log('Connected to conversation'),
        onDisconnect: () => console.log('Disconnected from conversation'),
        onMessage: (message) => console.log('Received message:', message),
        onError: (error) => console.error('Conversation error:', error),
        onModeChange: (mode) => console.log('Conversation mode changed:', mode),
        onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
        onCanSendFeedbackChange: (prop) =>
            console.log('Can send feedback changed:', prop.canSendFeedback),
        onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
    });
    
}



  const conversation = useConversation();



  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white">Call Agent Screen</Text>
      {!isConnected ? (
        <Button title="Start Call" onPress={startConversation} />
      ) : (
        <Button title="End Call" onPress={endConversation} />
      )}
    </View>
  );
}
