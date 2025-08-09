import "./global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ElevenLabsProvider } from '@elevenlabs/react-native';
import { AppContent } from './AppContent';





export default function App() {
  return (
    <SafeAreaProvider>
      <ElevenLabsProvider>
        <AppContent />
      </ElevenLabsProvider>
    </SafeAreaProvider>
  );
}