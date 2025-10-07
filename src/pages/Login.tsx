// src/pages/Login.tsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/charts/linebar"); // redirect to dashboard
    } else {
      setError("Invalid email or password");
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" className="!mt-4 !bg-gray-800 hover:!bg-gray-900">
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
