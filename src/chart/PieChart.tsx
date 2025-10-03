import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface PairData {
  name: string;
  value: number;
}

const PAIRS = ["btcusdt", "ethusdt", "bnbusdt"]; // pairs to show

const PieChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [data, setData] = useState<PairData[]>(
    PAIRS.map((p) => ({ name: p.toUpperCase(), value: 0 }))
  );

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    // Combined WebSocket for all pairs
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${PAIRS.map(p => p + "@aggTrade").join("/")}`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const stream: string = msg.stream;
      const pair = stream.split("@")[0].toUpperCase();
      const volume = parseFloat(msg.data.q); // trade quantity

      setData((prev) =>
        prev.map((d) =>
          d.name === pair ? { ...d, value: d.value + volume } : d
        )
      );
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error", err);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const option: echarts.EChartsOption = {
      title: {
        text: "Binance Trading Volume",
        subtext: "Live Data",
        left: "center",
        top: 5,
          textStyle: {
          color: "white"
        }
      },
      tooltip: { trigger: "item" },
      legend: { orient: "vertical", left: "left" },
series: [
  {
    name: "Volume",
    type: "pie",
    radius: "50%",
    label: {
      show: true,
      color: "#FFFFFF", // color of the text labels
      fontSize: 14,
      fontWeight: "bold"
    },
    data: data.map((item, index) => ({
      ...item,
      // Assign a custom color per slice (you can define your own array of colors)
      itemStyle: {
        color: ["#FF0000", "#ffd700", "#454545"][index % 5]
      }
    })),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)"
      }
    }
  }
]

    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: "700px", height: "500px" }} />;
};

export default PieChart;
