import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrainScreen from './screen/trainScreen';
import PlanScreen from './screen/planScreen';

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
                <View
                    className="bg-gray-800 rounded-full p-1"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                >
                    <View className="flex-row">
                        {/* Bouton Train */}
                        <TouchableOpacity
                            className={`px-10 py-4 rounded-full ${activeScreen === 'train'
                                ? 'bg-white'
                                : 'bg-transparent'
                                }`}
                            onPress={() => setActiveScreen('train')}
                            style={{
                                minWidth: 120,
                            }}
                        >
                            <Text className={`text-center font-semibold text-base ${activeScreen === 'train'
                                ? 'text-gray-800'
                                : 'text-gray-400'
                                }`}>
                                Train
                            </Text>
                        </TouchableOpacity>

                        {/* Bouton Plan */}
                        <TouchableOpacity
                            className={`px-10 py-4 rounded-full ${activeScreen === 'plan'
                                ? 'bg-white'
                                : 'bg-transparent'
                                }`}
                            onPress={() => setActiveScreen('plan')}
                            style={{
                                minWidth: 120,
                            }}
                        >
                            <Text className={`text-center font-semibold text-base ${activeScreen === 'plan'
                                ? 'text-gray-800'
                                : 'text-gray-400'
                                }`}>
                                Plan
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}