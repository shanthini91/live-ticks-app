import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface Tick {
  time: string;
  price: number;
  volume: number;
}

const LineBarChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [data, setData] = useState<Tick[]>([]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@aggTrade");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const tick: Tick = {
        price: parseFloat(msg.p),
        volume: parseFloat(msg.q), // trade quantity
        time: new Date(msg.T).toLocaleTimeString()
      };
      setData((prev) => [...prev.slice(-100), tick]); // keep last 100 ticks
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
      title: { text: "BTC/USDT Live Line + Bar", left: "center", top: 5,
        textStyle: {
          color: "white"
        }
       },
      tooltip: { trigger: "axis" },
      toolbox: {
        feature: {
          restore: { show: false },
          saveAsImage: { show: false },
          magicType: { show: false, type: ["line", "bar"] }
        }
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.time),
        boundaryGap: true,
        axisLabel: { color: "white"}
      },
      yAxis: [
        { type: "value", name: "Price", position: "left", scale: true, axisLabel: { color: "white"}},
        { type: "value", name: "Volume", position: "right", axisLabel: { color: "white"}},
      ],

      series: [
        {
          name: "Price",
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          symbol: "none",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgb(255, 223, 0)" },
              { offset: 1, color: "rgb(183, 136, 17)" }
            ])
          },
          itemStyle: { color: "#ffd700" },
          data: data.map((d) => d.price)
        },
        {
          name: "Volume",
          type: "bar",
          yAxisIndex: 1,
          itemStyle: { color: "#ffd700" },
          data: data.map((d) => d.volume)
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: "700px", height: "500px" }} />;
};

export default LineBarChart;
