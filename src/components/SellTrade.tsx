import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function SellTrade() {
  const { user } = useAuth();
  const [myBuys, setMyBuys] = useState<{ symbol: string; amount: string }[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [sellAmount, setSellAmount] = useState("");

useEffect(() => {
  if (!user) return;

  const key = `trades_${user.email}`;
  const stored = JSON.parse(localStorage.getItem(key) || "[]");

  // Filter only unsold buys
  const buys = stored.filter((t: any) => t.type === "Buy");
  const sells = stored.filter((t: any) => t.type === "Sell");

  // Remove buys that have been sold (by symbol)
  const remaining = buys.filter(
    (buy: any) => !sells.some((sell: any) => sell.symbol === buy.symbol)
  );

  setMyBuys(remaining);
}, [user]);


const handleSell = () => {
  if (!selectedSymbol || !sellAmount)
    return alert("Select symbol and amount");

  const key = `trades_${user?.email}`;
  const stored = JSON.parse(localStorage.getItem(key) || "[]");

  // If already sold, stop
  const alreadySold = stored.some(
    (t: any) => t.symbol === selectedSymbol && t.type === "Sell"
  );
  if (alreadySold) return alert("This symbol is already sold!");

  const updated = [
    ...stored,
    {
      symbol: selectedSymbol,
      amount: sellAmount,
      type: "Sell",
      date: new Date().toLocaleString(),
    },
  ];

  localStorage.setItem(key, JSON.stringify(updated));
  setMyBuys(myBuys.filter((t) => t.symbol !== selectedSymbol)); // remove from dropdown
  alert(`💰 Sold ${sellAmount} of ${selectedSymbol}`);
  setSellAmount("");
  setSelectedSymbol("");
};


  return (
      <Paper
        elevation={6}
        className="p-6 w-[750px] !bg-gray-800 text-white rounded-xl shadow-lg"
      >
        <Typography className="text-yellow-500 text-sm" align="center" gutterBottom>
          Sell Crypto
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="symbol-label" sx={{ color: "white" }}>
            Select from your buys
          </InputLabel>
          <Select
            labelId="symbol-label"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            sx={{ color: "white" }}
            className="!bg-gray-700"
          >
            {myBuys.map((t, i) => (
              <MenuItem key={i} value={t.symbol}>
                {t.symbol} — {t.amount}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Sell Amount"
          type="number"
          fullWidth
          value={sellAmount}
          onChange={(e) => setSellAmount(e.target.value)}
          className="!bg-gray-700 rounded"
          margin="normal"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Button
          variant="contained"
          fullWidth
          className="!mt-4 !bg-yellow-500 !text-black hover:!bg-yellow-600"
          onClick={handleSell}
        >
          Sell
        </Button>
      </Paper>
  );
}
