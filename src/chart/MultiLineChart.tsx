import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface Tick {
  time: string;
  price: number;
}

const PAIRS = ["btcusdt", "ethusdt", "bnbusdt"]; // add more pairs if needed

const MultiLineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  // Store ticks per pair
  const [data, setData] = useState<Record<string, Tick[]>>(
    PAIRS.reduce((acc, pair) => {
      acc[pair] = [];
      return acc;
    }, {} as Record<string, Tick[]>)
  );

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    // Single WebSocket for multiple pairs
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${PAIRS.map(p => p + "@aggTrade").join("/")}`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const stream: string = msg.stream; // e.g., btcusdt@aggTrade
      const pair = stream.split("@")[0];
      const tick: Tick = {
        price: parseFloat(msg.data.p),
        time: new Date(msg.data.T).toLocaleTimeString()
      };

      setData(prev => {
        const copy = { ...prev };
        copy[pair] = [...copy[pair].slice(-50), tick]; // last 50 ticks
        return copy;
      });
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error", err);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    // Prepare series for each pair
    const seriesList: echarts.EChartsOption["series"] = PAIRS.map((pair, idx) => ({
      type: "line",
      name: pair.toUpperCase(),
      showSymbol: false,
      smooth: true,
      data: data[pair].map(d => d.price),
      itemStyle: {
        color: ["#FF5733", "#33C1FF", "#9D33FF"][idx % 10] // different color per line
      },
      areaStyle: {
        opacity: 0.2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgb(255, 223, 0)" },
          { offset: 1, color: "rgb(183, 136, 17)" }
        ])
      }
    }));

    chartInstance.current.setOption({
      title: {
        text: "Live Binance Multiple Pairs", left: "center", top: 5,
        textStyle: {
          color: "white"
        }
      },
      tooltip: { trigger: "axis" },
      legend: { data: PAIRS.map(p => p.toUpperCase()), top: 30 },
      xAxis: {
        type: "category",
        data: data[PAIRS[0]]?.map(d => d.time) || [], axisLabel: { color: "white" }
      },
      yAxis: { type: "value", scale: true, axisLabel: { color: "white" } },

      series: seriesList
    });
  }, [data]);

  return <div ref={chartRef} style={{ width: "700px", height: "500px" }} />;
};

export default MultiLineChart;
