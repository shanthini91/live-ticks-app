import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface Symbol {
  symbol: string;
}

export default function BuyTrade() {
  const { user } = useAuth();
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then((res) => res.json())
      .then((data) => {
        const list = data.symbols
          .filter((s: any) => s.quoteAsset === "USDT")
          .slice(0, 50);
        setSymbols(list);
      });
  }, []);

  const handleBuy = () => {
    if (!selectedSymbol || !amount) return alert("Select symbol and amount");

    const key = `trades_${user?.email}`;
    const trades = JSON.parse(localStorage.getItem(key) || "[]");

const updated = [
  ...trades,
  { symbol: selectedSymbol, amount, type: "Buy", date: new Date().toLocaleString() },
];    localStorage.setItem(key, JSON.stringify(updated));

    alert(`✅ Bought ${amount} of ${selectedSymbol}`);
    setAmount("");
    setSelectedSymbol("");
  };

  return (
      <Paper
        elevation={6}
        className="p-6 w-[750px] h-[500px] !bg-gray-800 text-white rounded-xl shadow-lg"
      >
        <Typography variant="h5" align="center" className="text-white" gutterBottom>
          Buy Crypto
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="symbol-label" sx={{ color: "white" }}>
            Symbol
          </InputLabel>
          <Select
            labelId="symbol-label"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            sx={{ color: "white" }}
            className="!bg-gray-700"
          >
            {symbols.map((s) => (
              <MenuItem key={s.symbol} value={s.symbol}>
                {s.symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="!bg-gray-700 rounded"
          margin="normal"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Button
          variant="contained"
          fullWidth
          className="!mt-4 !bg-yellow-500 !text-black hover:!bg-yellow-600"
          onClick={handleBuy}
        >
          Buy
        </Button>
      </Paper>
  );
}
