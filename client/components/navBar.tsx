import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";

interface NavBarProps {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
}

export default function NavBar({ activeScreen, setActiveScreen }: NavBarProps) {
    return (

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
    )
}