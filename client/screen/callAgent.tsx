import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
//import { Conversation, Callbacks, Role, Mode, Status } from "@elevenlabs/client";
import { useConversation } from '@elevenlabs/react-native';
import { Audio } from 'expo-av';



export default function CallAgentScreen() {
  //const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to conversation')
      setIsConnected(true)
    },
    onDisconnect: () => {
      console.log('Disconnected from conversation')
      setIsConnected(false)
    },
    onMessage: (message) => console.log('Received message:', message),
    onError: (error) => console.error('Conversation error:', error),
    onModeChange: (mode) => console.log('Conversation mode changed:', mode),
    onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
    onCanSendFeedbackChange: (prop) => console.log('Can send feedback changed:', prop.canSendFeedback),
    onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
  });

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
        startRecording();
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

    const sendContextualUpdate = async () => {
      await conversation.sendContextualUpdate(
        'User navigated to the profile page. Consider this for next response.'
      );
    };

    const toggleConversation = () => {
      if (!isConnected) {
        startConversation();
      } else {
        endConversation();
      }
    };

    
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Call Agent Screen</Text>

      {/* Floating Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: isConnected ? '#ff4d4d' : '#4CAF50' }]}
        onPress={toggleConversation}
      >
        <Text style={styles.buttonText}>
          {isConnected ? 'Stop' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // dark bg for visibility
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40, // a bit above the bottom
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});