import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useData } from "../hooks/useData"; // adjust path
import {useState, useEffect} from "react";

import Svg, { Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from "react-native-svg";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { max } from "d3-array";

import * as d3 from "d3";
import { useDataContext } from "../context/dataProvider";

    
export default function LineChart() {
  const { dailyLogs, timelineData } = useDataContext();
  const [chartData, setChartData] = useState<any[]>([]);
  console.log("daliLogs : ", dailyLogs)
  useEffect(() => {
      if (!dailyLogs || Object.keys(dailyLogs).length === 0) return;

      // Transform the dailyLogs into array format for D3
      const formattedData = Object.entries(dailyLogs).map(([date, log]) => ({
          date: new Date(date) || new Date(0),
          sleep_seconds: log.sleep_seconds || 0,
          calories: log.calories || 0,
          weight_kg: log.weight_kg || 0,
      }));
      console.log("Formatted data:", formattedData);
      // Sort by date (important for line charts)
      formattedData.sort((a, b) => a.date.getTime() - b.date.getTime());

      setChartData(formattedData);
      console.log("Formatted data:", formattedData);
  }, [dailyLogs]);

  if (chartData.length === 0) return <Text>Loading viz...</Text>;
  console.log("Chart data:", chartData);
  return <GraphVisualization data={chartData} />;
}


type DataPoint = {
  date: Date;
  sleep_seconds: number;
  calories: number;
  weight_kg: number;
};

interface GraphProps {
  data: DataPoint[];
}

function GraphVisualization({ data }: GraphProps) {
  const width = 370;
  const height = 200;
  const marginTop = 20;
  const marginRight = 15;
  const marginBottom = 20;
  const marginLeft = 15; // increased for Y labels

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
    .domain([0, max(data, (d) => d.sleep_seconds) as number])
    .nice()
    .range([height - marginBottom, marginTop]);

  // Line generator
  const line = d3Shape
    .line<DataPoint>()
    .x((d) => (x(d.date.toISOString()) ?? 0) + x.bandwidth() / 2)
    .y((d) => y(d.sleep_seconds));

  const pathData = line(data) || "";

  return (
    <View>
      <Text>Sleep time</Text>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient_1" x1="0%" y1="100%" x2="50%" y2="0%">
            <Stop offset="0%" stopColor="#4facfe" stopOpacity={1} />
            <Stop offset="100%" stopColor="#00f2fe" stopOpacity={1} />
          </LinearGradient>
        </Defs>

        {/* Y Axis line */}
        <Line
          x1={marginLeft}
          y1={marginTop}
          x2={marginLeft}
          y2={height - marginBottom}
          stroke="white"
          strokeWidth={1}
        />

        {/* X Axis line */}
        <Line
          x1={marginLeft}
          y1={height - marginBottom}
          x2={width - marginRight}
          y2={height - marginBottom}
          stroke="white"
          strokeWidth={1}
        />

        {/* X Axis labels */}
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

        {/* Y Axis labels */}
        <G>
          {[0, (max(data, (d) => d.sleep_seconds) as number) / 2, max(data, (d) => d.sleep_seconds) as number].map(
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

        {/* Line path */}
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


/*
function GraphVisualization({ data }: GraphProps) {
  const width = 300;
  const height = 200;
  const padding = 30;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Time</Text>
      <Svg width={width} height={height} style={styles.svg}>
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />

        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />

        <SvgText
          fill="white"
          fontSize="14"
          x={padding - 20}
          y={padding}
          textAnchor="middle"
        >
          Y
        </SvgText>


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
*/


