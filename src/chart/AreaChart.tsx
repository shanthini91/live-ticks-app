import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface Tick {
  time: string;
  price: number;
}

const AreaChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [data, setData] = useState<Tick[]>([]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    // Binance WebSocket for BTC/USDT aggregated trades
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@aggTrade");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const tick: Tick = {
        price: parseFloat(msg.p),
        time: new Date(msg.T).toLocaleTimeString()
      };
      setData((prev) => [...prev.slice(-500), tick]); // keep last 500 ticks
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error", err);

    return () => {
      ws.close();
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const option: echarts.EChartsOption = {
      title: { text: "BTC/USDT Live Ticks", left: "center", top: 5,
          textStyle: {
          color: "white"
        }
       },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data.map((d) => d.time), axisLabel: { color: "white"} },
      yAxis: { type: "value", scale: true, axisLabel: { color: "white"} },

      series: [
        {
          name: "Price",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "lttb",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgb(255, 223, 0)" },
              { offset: 1, color: "rgb(183, 136, 17)" }
            ])
          },
          itemStyle: { color: "#ffd700" },
          data: data.map((d) => d.price)
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: "700px", height: "500px" }} />;
};

export default AreaChart;
