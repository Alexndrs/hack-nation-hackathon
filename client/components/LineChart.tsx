import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useData } from "../hooks/useData"; // adjust path
import {useState, useEffect} from "react";

import Svg, { Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from "react-native-svg";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { max } from "d3-array";


export default function LineChart() {
  const { dailyLogs } = useData(); // fetches data via your getDailyLogs
  const [chartData, setChartData] = useState<any[]>([]);
  console.log("daliLogs : ", dailyLogs)
  useEffect(() => {
      if (!dailyLogs || Object.keys(dailyLogs).length === 0) return;

      // Transform the dailyLogs into array format for D3
      const formattedData = Object.entries(dailyLogs).map(([date, log]) => ({
          date: new Date(date),
          sleep_seconds: log.sleep_seconds || 0,
          calories: log.calories || 0,
          weight_kg: log.weight_kg || 0,
      }));

      // Sort by date (important for line charts)
      formattedData.sort((a, b) => a.date.getTime() - b.date.getTime());

      setChartData(formattedData);
  }, [dailyLogs]);

  if (chartData.length === 0) return <Text>Loading viz...</Text>;
  console.log("Chart data:", chartData);
  return <GraphVisualization/>;// data={chartData} />;
}


type DataPoint = {
  date: Date;
  close: number;
};

interface GraphProps {
  data: DataPoint[];
}


function GraphVisualization() {
  const width = 300;
  const height = 200;
  const padding = 30;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Graph</Text>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Y axis line */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />
        {/* X axis line */}
        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />

        {/* Y axis label */}
        <SvgText
          fill="white"
          fontSize="14"
          x={padding - 20}
          y={padding}
          textAnchor="middle"
        >
          Y
        </SvgText>

        {/* X axis label */}
        <SvgText
          fill="white"
          fontSize="14"
          x={width - padding}
          y={height - padding + 20}
          textAnchor="middle"
        >
          X
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 10,
  },
  svg: {
    backgroundColor: '#222',
  },
});

/*
function GraphVisualization({ data }: GraphProps) {
  const width = 800;
  const height = 500;
  const marginTop = 0;//20;
  const marginRight = 0;//70;
  const marginBottom = 0;//30;
  const marginLeft = 0;//40;

  console.log("Graph data:", data);

  // X scale
  const x = d3Scale
    .scaleBand<string>()
    .domain(data.map((d) => d.date.toISOString()))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  // Y scale
  const y = d3Scale
    .scaleLinear()
    .domain([0, max(data, (d) => d.close) as number])
    .nice()
    .range([height - marginBottom, marginTop]);

  // Line generator
  const line = d3Shape
    .line<DataPoint>()
    .x((d) => (x(d.date.toISOString()) ?? 0) + x.bandwidth() / 2)
    .y((d) => y(d.close));

  const pathData = line(data) || "";

  return (
    <View>
      <Text>Workout Data</Text>
      <Svg width={width} height={height}>
        {/* Gradient definition 
        <Defs>
          <LinearGradient id="gradient_1" x1="0%" y1="100%" x2="50%" y2="0%">
            <Stop offset="0%" stopColor="#4facfe" stopOpacity={1} />
            <Stop offset="100%" stopColor="#00f2fe" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        


        <G>
          {data.map((d, i) => (
            <SvgText
              key={i}
              x={(x(d.date.toISOString()) ?? 0) + x.bandwidth() / 2}
              y={height - 5}
              fontSize={12}
              fill="white"
              textAnchor="middle"
            >
              {d.date.toLocaleDateString()}
            </SvgText>
          ))}
        </G>


        <G>
          {[0, (max(data, (d) => d.close) as number) / 2, max(data, (d) => d.close) as number].map(
            (val, i) => (
              <SvgText
                key={i}
                x={marginLeft - 5}
                y={y(val)}
                fontSize={12}
                fill="white"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {val}
              </SvgText>
            )
          )}
        </G>

        <Path
          d={pathData}
          fill="none"
          stroke="url(#gradient_1)"
          strokeWidth={3.5}
        />
      </Svg>
    </View>
  );
}
*/
