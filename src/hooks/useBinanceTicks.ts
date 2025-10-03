import { useEffect, useRef, useState } from "react";

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  volume?: number;
  time: number;
  rowClass?: string;
};

type BinanceTradePayload = {
  s: string;
  p: string;
  q: string;
  T: number;
};

export const useBinanceTicks = (symbols: string[]) => {
  const [ticks, setTicks] = useState<Trade[]>([]);
  const prevPricesRef = useRef<Record<string, number>>({});
  const tickCountersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!symbols.length) return;

    const streams = symbols.map((s) => `${s.toLowerCase()}@trade`).join("/");
    const url =
      symbols.length > 1
        ? `wss://stream.binance.com:9443/stream?streams=${streams}`
        : `wss://stream.binance.com:9443/ws/${symbols[0].toLowerCase()}@trade`;

    const ws = new WebSocket(url);
    ws.onopen = () => console.log("✅ Binance WS connected:", url);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const payloads: BinanceTradePayload[] = msg.data ? [msg.data] : [msg];

      setTicks((prev) => {
        const newTicks: Trade[] = [];

        payloads.forEach((d) => {
          if (!d?.s || !d?.p) return;

          const symbol = d.s;
          const price = parseFloat(d.p);
          const volume = parseFloat(d.q || "0");

          const prevPrice = prevPricesRef.current[symbol];
          const rowClass =
            prevPrice !== undefined
              ? price > prevPrice
                ? "price-up"
                : price < prevPrice
                ? "price-down"
                : ""
              : "";

          prevPricesRef.current[symbol] = price;
          tickCountersRef.current[symbol] =
            (tickCountersRef.current[symbol] || 0) + 1;

          const id = `${symbol}-${tickCountersRef.current[symbol]}`;

          newTicks.push({ id, symbol, price, volume, time: d.T, rowClass });
        });

        return [...newTicks, ...prev].slice(0, 50);
      });
    };

    ws.onerror = (err) => console.error("❌ Binance WS error:", err);
    ws.onclose = () => console.log("🔌 Binance WS disconnected");

    return () => ws.close();
  }, [JSON.stringify(symbols)]);

  return ticks;
};
