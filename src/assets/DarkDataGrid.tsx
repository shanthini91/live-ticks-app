import { Paper, Box, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface GridProps {
  title: string;
  rows: any[];
  columns: GridColDef[];
}

export default function DarkDataGrid({ title, rows, columns }: GridProps) {
  return (
    <Paper
      elevation={6}
      className="w-full h-[150px] !bg-gray-800 text-white shadow-lg"
    >
      <Typography
        variant="h5"
        align="center"
        className="text-white pt-3 !bg-gray-800"
        gutterBottom
      >
        {title}
      </Typography>

      <Box className="!bg-gray-800 text-white h-[400px] px-3 pb-3">
        <DataGrid
          className="!bg-gray-800 text-white"
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
sx={{
  color: "white",
  backgroundColor: "#1f2937", // same as bg-gray-800
  border: "none",
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #374151",
    backgroundColor: "#1f2937", // same as bg-gray-800
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
