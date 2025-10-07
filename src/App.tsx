import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BinanceProvider } from "./context/BinanceSocketContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AreaChart from "./chart/AreaChart";
import MultiLineChart from "./chart/MultiLineChart";
import LineBarChart from "./chart/LineBarChart";
import PieChart from "./chart/PieChart";
import HeatMapChart from "./chart/HeatMapChart";
import DashboardLayout from "./layout/DashboardLayout";
import NewsPage from "./pages/NewsPage";
import AccountPage from "./pages/AccountPage";
import ChartPage from "./pages/ChartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTrades from "./components/MyTrades";
import BuyTrade from "./components/BuyTrade";
import SellTrade from "./components/SellTrade";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BinanceProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="account" element={<AccountPage />} />
              <Route path="chart" element={<ChartPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="trades/mytrades" element={<MyTrades />} />
              <Route path="charts/area" element={<AreaChart />} />
              <Route path="charts/pie" element={<PieChart />} />
              <Route path="charts/linebar" element={<LineBarChart />} />
              <Route path="charts/multiline" element={<MultiLineChart />} />
              <Route path="charts/heatmap" element={<HeatMapChart />} />
              <Route path="trades/buy" element={<BuyTrade />} />
              <Route path="trades/sell" element={<SellTrade />} />
            </Route>

            {/* Redirect unknown paths to login */}
            <Route path="*" element={<Login />} />
          </Routes>
        </BinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
