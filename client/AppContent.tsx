import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrainScreen from './screen/trainScreen';
import PlanScreen from './screen/planScreen';
import NavBar from './components/navBar';
import { DataProvider } from './context/dataProvider';

export function AppContent() {
    const [activeScreen, setActiveScreen] = useState('train');
    const insets = useSafeAreaInsets();

    return (
        <DataProvider>
            <View className="flex-1 bg-zinc-950">
                {/* Contenu des screens */}
                <View className="flex-1">
                    {activeScreen === 'plan' ? <PlanScreen /> : <TrainScreen />}
                </View>

                {/* Navbar flottante */}
                <View
                    className="absolute left-0 right-0 items-center px-8"
                    style={{ bottom: Math.max(insets.bottom + 16, 32) }}
                >
                    <NavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
                </View>

            </View>
        </DataProvider>
    );
}