import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";

interface Trade {
  id: number;
  symbol: string;
  type: "Buy" | "Sell";
  amount: string;
  date: string;
}

export default function MyTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!user) return;
    const key = `trades_${user.email}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setTrades(
      data.map((t: any, index: number) => ({
        id: index + 1,
        symbol: t.symbol,
        type: t.type || "Buy",
        amount: t.amount,
        date: t.date || new Date().toLocaleString(),
      }))
    );
  }, [user]);

  const columns: GridColDef[] = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Buy" ? "#10b981" : "#ef4444",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 2 },
  ];

  return (
      <Paper
        elevation={6}
        className="w-[750px] h-[450px] max-w-4xl !bg-gray-800 text-white shadow-lg rounded-xl"
      >
        <Typography
          variant="h5"
          align="center"
          className="text-white py-3 !bg-gray-800"
          gutterBottom
        >
          My Trades
        </Typography>

        <Box className="!bg-gray-800 text-white h-[400px] px-3 pb-3">
          <DataGrid
            className="!bg-gray-800 text-white"
            rows={trades}
            columns={columns}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
sx={{
  color: "white",
  backgroundColor: "#1f2937", // same as bg-gray-800
  border: "none",
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #374151",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#1f2937",
    color: "#fff",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#1f2937", // ← add this line
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#374151",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#1f2937",
    color: "#fff",
  },
  "& .MuiTablePagination-root": {
    color: "#fff",
  },
}}

          />
        </Box>
      </Paper>

  );
}
