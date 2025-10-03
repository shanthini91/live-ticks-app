import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("user", email);
      navigate("/chart");
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-900">
      <Paper
        elevation={6}
        className="p-6 w-[350px] !bg-yellow-500 text-black rounded-xl shadow-lg"
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ className: "text-white" }}
            InputLabelProps={{ className: "text-gray-300" }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ className: "text-white" }}
            InputLabelProps={{ className: "text-gray-300" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="!mt-4 !bg-gray-800 hover:!bg-gray-900"
          >
            Login
          </Button>

          <Typography variant="body2" align="center" className="mt-4">
            New user?{" "}
            <Link to="/register" className="!text-gray-700 hover:!text-gray-900 hover:underline">
              Register
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
