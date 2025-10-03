import React, { createContext, useContext } from "react";
import { useBinanceTicks, type Trade } from "../hooks/useBinanceTicks";

type BinanceContextType = { ticks: Trade[] };
const BinanceContext = createContext<BinanceContextType>({ ticks: [] });

export const useBinance = () => useContext(BinanceContext);

export const BinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT"]; // make sure symbols match Binance stream
  const ticks = useBinanceTicks(SYMBOLS);

  return <BinanceContext.Provider value={{ ticks }}>{children}</BinanceContext.Provider>;
};
export type { Trade };
