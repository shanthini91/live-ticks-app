import React, { useMemo, useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, type ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useBinance, type Trade } from "../context/BinanceSocketContext";

ModuleRegistry.registerModules([AllCommunityModule]);

const BinanceGrid: React.FC = () => {
  const { ticks } = useBinance();

  // Throttled state
  const [displayTicks, setDisplayTicks] = useState<Trade[]>([]);
  const ticksRef = useRef<Trade[]>([]);

  // Save incoming ticks to ref (fast updates)
  useEffect(() => {
    ticksRef.current = ticks;
  }, [ticks]);

  // Update displayTicks every 500ms (or whatever interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTicks([...ticksRef.current]);
    }, 5000); // 500ms update interval
    return () => clearInterval(interval);
  }, []);

  const columnDefs: ColDef<Trade>[] = useMemo(
    () => [
      { field: "symbol", headerName: "Symbol", sortable: true, filter: true, flex: 1 },
      {
        field: "price",
        headerName: "Price",
        sortable: true,
        valueFormatter: (p) => (p.value !== undefined ? `$${p.value.toFixed(2)}` : ""),
        cellStyle: (p) => ({
          fontWeight: "bold",
          color:
            p.data?.rowClass === "price-up"
              ? "green"
              : p.data?.rowClass === "price-down"
              ? "red"
              : "white",
        }),
        flex: 1,
      },
      { field: "volume", headerName: "Volume", sortable: true, flex: 1 },
      {
        field: "time",
        headerName: "Time",
        valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleTimeString() : ""),
        flex: 1,
      },
    ],
    []
  );

  return (
    <div className="ag-theme-material w-full h-[350px] shadow-md border custom-scrollbar border-gray-900">
      <AgGridReact<Trade>
        className="bg-gray-800"
        rowData={displayTicks} // <- use throttled data
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, minWidth: 100 }}
        animateRows
        pagination
        paginationPageSize={10}
        getRowId={(params) => params.data.id}
        getRowClass={(params) => params.data?.rowClass || ""}
      />
    </div>
  );
};

export default BinanceGrid;
