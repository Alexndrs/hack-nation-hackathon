import React, { useState } from "react";
import { View } from "react-native";

import DateNav from "../components/dateNav";
import DailyLogForm from "../components/dailyLogForm";


export default function PlanScreen() {

    const [date, setDate] = useState(new Date());

    const handlePreviousDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
    }

    const handleNextDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
    }


    return (
        <View className="flex-1 items-center ">
            <DateNav
                handlePreviousDay={handlePreviousDay}
                handleNextDay={handleNextDay}
                date={date}
            />
            <DailyLogForm date={date} />
        </View>
    );
}