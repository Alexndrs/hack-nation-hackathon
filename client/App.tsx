import "./global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContent } from './AppContent';





export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}