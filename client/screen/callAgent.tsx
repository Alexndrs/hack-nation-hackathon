import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Conversation } from "@elevenlabs/client";
// If using Expo, you can use `import * as Permissions from 'expo-permissions';`
// or `import { Audio } from 'expo-av';` for mic access

export default function CallAgentScreen() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  async function startConversation() {
    try {
      // TODO: Request mic permissions here
      // For bare RN: use `react-native-permissions`
      // For Expo: `await Audio.requestPermissionsAsync();`

      const agentId = process.env.EXPO_PUBLIC_AGENT_ID || "agent_3601k281n3v2ef3b66nat7yn05aa";
      const conv = await Conversation.startSession({
        agentId,
        // If private agent: pass signed URL instead
      });

      conv.on("message", (msg: any) => {
        console.log("Agent says:", msg);
      });

      conv.on("end", () => {
        console.log("Conversation ended.");
        setIsConnected(false);
      });

      conv.on("error", (err: any) => {
        console.error("Error:", err);
        Alert.alert("Error", String(err));
      });

      setConversation(conv);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", String(err));
    }
  }

  function endConversation() {
    if (conversation) {
      conversation.end();
      setConversation(null);
      setIsConnected(false);
    }
  }

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
