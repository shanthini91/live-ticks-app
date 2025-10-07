// src/pages/UserHistory.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";

interface HistoryItem {
  id: number;
  action: string;
  time: string;
}

export default function UserHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const key = `history_${user.email}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setHistory(
      data.map((h: any, index: number) => ({
        id: index + 1,
        action: h.action,
        time: h.time,
      }))
    );
  }, [user]);

  const columns: GridColDef[] = [
    { field: "action", headerName: "Action", flex: 1 },
    { field: "time", headerName: "Timestamp", flex: 2 },
  ];

  return (
    <Paper
      elevation={6}
      className="w-full h-[100px]  !bg-gray-800 text-white shadow-lg"
    >
      <Typography
        align="center"
        className="text-yellow-500 py-3 text-sm !bg-gray-800"
        gutterBottom
      >
        Login / Logout History
      </Typography>

      <Box className="!bg-gray-800 text-white h-[400px] px-3 pb-3">
        <DataGrid
          rows={history}
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
