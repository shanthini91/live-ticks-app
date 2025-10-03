import React, { useEffect, useRef } from "react";
import { createChart, type IChartApi, type ISeriesApi, type UTCTimestamp, type CandlestickData } from "lightweight-charts";
import { useBinance } from "../context/BinanceSocketContext";

const ChartPage: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const candlesRef = useRef<CandlestickData<UTCTimestamp>[]>([]);
  const { ticks } = useBinance();

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { 
  background: { color: "#1f2937" }, 
  textColor: "#ffffff" 
}
,
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderVisible: true,
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Update chart with live ticks
  useEffect(() => {
    if (!candleSeriesRef.current || !ticks.length) return;

    const lastTick = ticks[0];
    const time: UTCTimestamp = Math.floor(lastTick.time / 1000) as unknown as UTCTimestamp;

    let prevCandle = candlesRef.current[candlesRef.current.length - 1];
    let candle: CandlestickData<UTCTimestamp>;

    if (prevCandle && prevCandle.time === time) {
      // Update existing candle
      candle = {
        ...prevCandle,
        high: Math.max(prevCandle.high, lastTick.price),
        low: Math.min(prevCandle.low, lastTick.price),
        close: lastTick.price,
      };
      candlesRef.current[candlesRef.current.length - 1] = candle;
    } else {
      // Create new candle
      candle = {
        time,
        open: lastTick.price,
        high: lastTick.price,
        low: lastTick.price,
        close: lastTick.price,
      };
      candlesRef.current.push(candle);

      // Optional: limit candle history
      if (candlesRef.current.length > 500) {
        candlesRef.current.shift();
      }
    }

    candleSeriesRef.current.update(candle);
  }, [ticks]);

  return <div ref={chartContainerRef} className="w-[700px] h-[500px] border shadow-md border-gray-900" />;
};

export default ChartPage;
