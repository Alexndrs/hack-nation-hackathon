import { View, Text, TextInput } from "react-native";

type InputFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
};

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder }) => (
    <View className="flex flex-col items-center">
        <Text className="text-gray-200 text-base font-bold ml-2 min-w-16">
            {label}
        </Text>
        <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#666"
            keyboardType="numeric"
            className="ml-3 px-3 py-2 bg-white/10 text-white rounded-lg border border-white/10 text-right w-20"
        />
    </View>
);

export default InputField;