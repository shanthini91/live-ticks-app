import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface HeatmapPoint {
  x: string; // time bucket
  y: string; // price range
  value: number; // intensity
}

const HeatMapChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [data, setData] = useState<HeatmapPoint[]>([]);

  // Helper: round price to nearest interval (e.g., 100)
  const roundTo = (value: number, step: number) =>
    Math.round(value / step) * step;

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@aggTrade");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const price = parseFloat(msg.p);
      const volume = parseFloat(msg.q);
      const time = new Date(msg.T);
      const minute = time.getMinutes().toString().padStart(2, "0");
      const second = time.getSeconds().toString().padStart(2, "0");
      const timeBucket = `${minute}:${second}`;
      const priceBucket = roundTo(price, 100).toString();

      setData((prev) => {
        const existing = [...prev];
        const index = existing.findIndex(
          (d) => d.x === timeBucket && d.y === priceBucket
        );

        if (index > -1) {
          existing[index].value += volume; // accumulate volume
        } else {
          existing.push({ x: timeBucket, y: priceBucket, value: volume });
        }

        // Keep only last ~60 seconds worth of data
        return existing.slice(-60);
      });
    };

    ws.onopen = () => console.log("✅ Binance WS Connected");
    ws.onclose = () => console.log("❌ Binance WS Disconnected");
    ws.onerror = (err) => console.error("⚠️ WS Error", err);

    return () => {
      ws.close();
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    if (data.length === 0) return;

    const xLabels = Array.from(new Set(data.map((d) => d.x))).sort();
    const yLabels = Array.from(new Set(data.map((d) => d.y))).sort(
      (a, b) => parseFloat(b) - parseFloat(a)
    );

    const heatmapData = data.map((d) => [
      xLabels.indexOf(d.x),
      yLabels.indexOf(d.y),
      d.value,
    ]);

    const option: echarts.EChartsOption = {
      
      title: {
        text: "BTC/USDT Live Heatmap",
        left: "center",
        textStyle: { color: "#fff" },
      },
      tooltip: {
        position: "top",
        formatter: (params: any) => {
          const [xIdx, yIdx, val] = params.value;
          return `
            <b>Time:</b> ${xLabels[xIdx]}<br/>
            <b>Price:</b> ${yLabels[yIdx]}<br/>
            <b>Volume:</b> ${val.toFixed(3)}
          `;
        },
      },
      grid: {
        height: "60%",
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { color: "#fff" },
      },
      yAxis: {
        type: "category",
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { color: "#fff" },
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map((d) => d.value), 1),
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "5%",
        textStyle: { color: "#fff" },
        inRange: {
          color: ["#003366", "#0066cc", "#00cc99", "#ffcc00", "#ff3300"],
        },
      },
      series: [
        {
          name: "Trade Intensity",
          type: "heatmap",
          data: heatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "800px",
        height: "500px"
      }}
    />
  );
};

export default HeatMapChart;
