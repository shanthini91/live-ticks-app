import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import customTheme from "../assets/theme";

const Navbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chartAnchorEl, setChartAnchorEl] = useState<null | HTMLElement>(null);
  const [tradeAnchorEl, setTradeAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const chartOpen = Boolean(chartAnchorEl);
  const tradeOpen = Boolean(tradeAnchorEl);
  const location = useLocation(); // 👈 for detecting active route

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleChartMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setChartAnchorEl(event.currentTarget);
  };
  const handleChartMenuClose = () => setChartAnchorEl(null);

    const handleTradeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTradeAnchorEl(event.currentTarget);
  };
  const handleTradeMenuClose = () => setTradeAnchorEl(null);

  const handleThemeChange = () => {
    document.documentElement.classList.toggle("dark");
    handleMenuClose();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 border-b-2 border-transparent hover:text-yellow-400 transition-all duration-200 ${
      isActive ? "text-yellow-400" : ""
    }`;

  // 👇 Detect if the current route is under /charts/
  const isChartActive = location.pathname.startsWith("/charts/");
  const isTradeActive = location.pathname.startsWith("/trade/");

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-2 shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>

        <ThemeProvider theme={customTheme}>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleThemeChange}>Change Theme</MenuItem>
            <MenuItem>
              <NavLink
                to="/login"
                className="w-full"
                onClick={handleThemeChange}
              >
                Logout
              </NavLink>
            </MenuItem>
          </Menu>
        </ThemeProvider>

        <ul className="flex flex-row gap-2 list-none items-center">
          <NavLink to="/account" className={linkClass}>
            Accounts
          </NavLink>

          {/* Charts menu with submenu */}
          <li className="relative">
            <Button
              onClick={handleChartMenuOpen}
              sx={{
                color: isChartActive ? "#facc15" : "white", // 👈 active color logic
                textTransform: "none",
                fontSize: "13px",
                "&:hover": {
                  color: "#facc15",
                },
              }}
            >
              Charts
            </Button>

            <ThemeProvider theme={customTheme}>
              <Menu
                anchorEl={chartAnchorEl}
                open={chartOpen}
                onClose={handleChartMenuClose}
              >
                <MenuItem onClick={handleChartMenuClose}>
                  <NavLink to="/charts/area" className="w-full text-xs">
                    Area Chart
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleChartMenuClose}>
                  <NavLink to="/charts/multiline" className="w-full text-xs">
                    Multi-Line Chart
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleChartMenuClose}>
                  <NavLink to="/charts/pie" className="w-full text-xs">
                    Pie Chart
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleChartMenuClose}>
                  <NavLink to="/charts/linebar" className="w-full text-xs">
                    Line Bar Chart
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleChartMenuClose}>
                  <NavLink to="/charts/heatmap" className="w-full text-xs">
                    Heatmap Chart
                  </NavLink>
                </MenuItem>
              </Menu>
            </ThemeProvider>
          </li>

          <NavLink to="/news" className={linkClass}>
            News
          </NavLink>
                    {/* Trades menu with submenu */}
          <li className="relative">
            <Button
              onClick={handleTradeMenuOpen}
              sx={{
                color: isTradeActive ? "#facc15" : "white", // 👈 active color logic
                textTransform: "none",
                fontSize: "13px",
                "&:hover": {
                  color: "#facc15",
                },
              }}
            >
              MyTrades
            </Button>

            <ThemeProvider theme={customTheme}>
              <Menu
                anchorEl={tradeAnchorEl}
                open={tradeOpen}
                onClose={handleTradeMenuClose}
              >
                <MenuItem onClick={handleTradeMenuClose}>
                  <NavLink to="/trades/mytrades" className="w-full text-xs">
                    My Trades
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleTradeMenuClose}>
                  <NavLink to="/trades/buy" className="w-full text-xs">
                    Buy Trade
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleTradeMenuClose}>
                  <NavLink to="/trades/sell" className="w-full text-xs">
                    Sell Trade
                  </NavLink>
                </MenuItem>
              </Menu>
            </ThemeProvider>
            </li>
        </ul>
      </div>

      {/* Right section */}
      <div className="font-mono">{time.toLocaleTimeString()}</div>
    </div>
  );
};

export default Navbar;
