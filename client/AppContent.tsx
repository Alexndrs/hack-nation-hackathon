import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrainScreen from './screen/trainScreen';
import PlanScreen from './screen/planScreen';
import NavBar from './components/navBar';

export function AppContent() {
    const [activeScreen, setActiveScreen] = useState('train');
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-gray-900">
            {/* Contenu des screens */}
            <View className="flex-1">
                {activeScreen === 'train' ? <TrainScreen /> : <PlanScreen />}
            </View>

            {/* Navbar flottante */}
            <View
                className="absolute left-0 right-0 items-center px-8"
                style={{ bottom: Math.max(insets.bottom + 16, 32) }}
            >
                <NavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            </View>

        </View>
    );
}