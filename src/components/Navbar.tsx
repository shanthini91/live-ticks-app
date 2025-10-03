import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from '@mui/material/styles';
import customTheme from '../assets/theme';

const Navbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chartAnchorEl, setChartAnchorEl] = useState<null | HTMLElement>(null); // submenu anchor
  const open = Boolean(anchorEl);
  const chartOpen = Boolean(chartAnchorEl);

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

  const handleThemeChange = () => {
    document.documentElement.classList.toggle("dark");
    handleMenuClose();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 border-b-2 border-transparent hover:text-yellow-400 transition-all duration-200 ${
      isActive ? "text-yellow-400" : ""
    }`;

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
              <NavLink to="/login" className="w-full text-black" onClick={handleMenuClose}>
                Logout
              </NavLink>
            </MenuItem>
          </Menu>
        </ThemeProvider>

        <ul className="flex flex-row gap-2 list-none items-center">
          <NavLink to="/account" className={linkClass}>Accounts</NavLink>

          {/* Charts menu with submenu */}
          <li className="relative">
            <Button
              onClick={handleChartMenuOpen}
              sx={{ color: "white", textTransform: "none" }}
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
                <NavLink to="/charts/area" className="w-full">Area Chart</NavLink>
              </MenuItem>
              <MenuItem onClick={handleChartMenuClose}>
                <NavLink to="/charts/multiline" className="w-full">Multi-Line Chart</NavLink>
              </MenuItem>
              <MenuItem onClick={handleChartMenuClose}>
                <NavLink to="/charts/pie" className="w-full">Pie Chart</NavLink>
              </MenuItem>
              <MenuItem onClick={handleChartMenuClose}>
                <NavLink to="/charts/linebar" className="w-full">Line Bar Chart</NavLink>
              </MenuItem>
            </Menu>
            </ThemeProvider>
          </li>

          <NavLink to="/news" className={linkClass}>News</NavLink>
        </ul>
      </div>

      {/* Right section */}
      <div className="font-mono">{time.toLocaleTimeString()}</div>
    </div>
  );
};

export default Navbar;
