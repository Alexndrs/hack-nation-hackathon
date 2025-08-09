import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";

interface NavBarProps {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
}

export default function NavBar({ activeScreen, setActiveScreen }: NavBarProps) {
    return (

        <View
            className="bg-white/10 border border-white/10 rounded-full p-1 shadow-xl"
        >
            <View className="flex-row">
                {/* Bouton Train */}
                <TouchableOpacity
                    className={`px-8 py-4 rounded-full ${activeScreen === 'train'
                        ? 'bg-white/10 border border-white/10'
                        : 'bg-transparent'
                        }`}
                    onPress={() => setActiveScreen('train')}
                    style={{
                        minWidth: 120,
                    }}
                >
                    <Text className={`text-center font-semibold text-base ${activeScreen === 'train'
                        ? 'text-gray-100'
                        : 'text-gray-400'
                        }`}>
                        Train
                    </Text>
                </TouchableOpacity>

                {/* Bouton Plan */}
                <TouchableOpacity
                    className={`px-8 py-4 rounded-full ${activeScreen === 'plan'
                        ? 'bg-white/10 border border-white/10'
                        : 'bg-transparent'
                        }`}
                    onPress={() => setActiveScreen('plan')}
                    style={{
                        minWidth: 120,
                    }}
                >
                    <Text className={`text-center font-semibold text-base ${activeScreen === 'plan'
                        ? 'text-gray-100'
                        : 'text-gray-400'
                        }`}>
                        Plan
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}