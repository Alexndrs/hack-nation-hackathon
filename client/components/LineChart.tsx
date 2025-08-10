<<<<<<< HEAD
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useData } from "../hooks/useData"; // adjust path
import {useState, useEffect} from "react";

import Svg, { Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from "react-native-svg";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { max } from "d3-array";
=======
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as d3 from "d3";
import { useData } from "../hooks/useData"; // adjust path
import Svg, { Path, Line, Circle, G } from "react-native-svg";
import { useDataContext } from "../context/dataProvider";

function LineChart() {
    const { dailyLogs, timelineData } = useDataContext(); // fetches data via your getDailyLogs

    const [chartData, setChartData] = useState<any[]>([]);
>>>>>>> ccd7d04a026207aa6a4af8aa3b53376f36a40d54


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

<<<<<<< HEAD

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
=======
function GraphVisualization({ data }: { data: DataPoint[] }) {
    const width = 800;
    const height = 500;
    const marginTop = 20;
    const marginRight = 70;
    const marginBottom = 30;
    const marginLeft = 40;

    d3.select("#line-container").select("svg").remove();
    const x = d3.scaleBand()
        .domain(data.map(d => d.date.toISOString()))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear<number, number>()
        .domain([0, d3.max(data, (d: DataPoint) => d.close) as number])
        .range([height - marginBottom, marginTop]);

    const line = d3.line<DataPoint>()
        .x(d => x(d.date.toISOString()) as number)
        .y(d => y(d.close));

    const svg = d3.select("#line-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const defs = svg.append("defs");
    const gradient_1 = defs
        .append("linearGradient")
        .attr("id", "gradient_1")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "50%")
        .attr("y2", "0%");

    gradient_1.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ffafcc");
    gradient_1.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#ffd7e6");

    // Add the x-axis.
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    xAxis.select("path.domain")
        .attr("stroke-dasharray", 13 * 80)
        .attr("stroke-dashoffset", 13 * 80)
        .transition()
        .duration(800)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
>>>>>>> ccd7d04a026207aa6a4af8aa3b53376f36a40d54

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

<<<<<<< HEAD
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
=======
    xAxis
        .call((g) =>
            g.append("text")
                .attr("x", width - marginRight + 5)
                .attr("y", 5)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Weeks")
        )
        .attr("font-size", 2)
        .attr("opacity", 0)
        .transition()
        .delay(1500)
        .duration(800)
        .ease(d3.easeElastic)
        .delay((d: unknown, i: number) => Math.random() * 1000)
        .attr("font-size", 12)
        .attr('opacity', 1)
        .attr("font-weight", "bold");

>>>>>>> ccd7d04a026207aa6a4af8aa3b53376f36a40d54

/*
function GraphVisualization({ data }: GraphProps) {
  const width = 800;
  const height = 500;
  const marginTop = 0;//20;
  const marginRight = 0;//70;
  const marginBottom = 0;//30;
  const marginLeft = 0;//40;

<<<<<<< HEAD
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
=======
    const yAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40));


    yAxis.select("path.domain")
        .attr("stroke-dasharray", height * 40)
        .attr("stroke-dashoffset", height * 40)
        .transition()
        .duration(2500)
        .delay(1500)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);



    interface TickDatum {
        value: number;
        index: number;
    }

    yAxis.selectAll<SVGLineElement, TickDatum>(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.2)
        .attr("stroke-dasharray", width - marginLeft - marginRight)
        .attr("stroke-dashoffset", width - marginLeft - marginRight)
        .transition()
        .duration(2500)
        .delay((d: TickDatum, i: number) => Math.random() * 1000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);



    yAxis
        .call((g) =>
            g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Hours invested per week")
        )
        .attr("font-size", 2)
        .attr("opacity", 0)
        .transition()
        .delay(1500)
        .duration(800)
        .ease(d3.easeElastic)
        .delay((d: any, i: number) => Math.random() * 1000)
        .attr("font-size", 12)
        .attr('opacity', 1)
        .attr("font-weight", "bold");



    const path = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#gradient_1)")
        .attr("stroke-width", 3.5)
        .attr("d", line(data));

    const totalLength = 1700;
    path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .delay(3000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
>>>>>>> ccd7d04a026207aa6a4af8aa3b53376f36a40d54


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
