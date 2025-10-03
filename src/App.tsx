import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BinanceProvider } from "./context/BinanceSocketContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AreaChart from "./chart/AreaChart";
import MultiLineChart from "./chart/MultiLineChart";
import LineBarChart from "./chart/LineBarChart";
import PieChart from "./chart/PieChart";
import DashboardLayout from "./layout/DashboardLayout";
import NewsPage from "./pages/NewsPage";
import AccountPage from "./pages/AccountPage";
import ChartPage from "./pages/ChartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
              <Route path="charts/area" element={<AreaChart />} />
              <Route path="charts/pie" element={<PieChart />} />
              <Route path="charts/linebar" element={<LineBarChart />} />
              <Route path="charts/multiline" element={<MultiLineChart />} />
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
