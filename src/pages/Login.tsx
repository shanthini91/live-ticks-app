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
    <Box className="flex justify-center items-center h-screen" 
    sx={{
        backgroundImage: 'url("/src/assets/loginbg.jpg")', // path to your image
        backgroundSize: "cover",        // ensures image covers container without stretching
        backgroundPosition: "center",   // centers the image
        backgroundRepeat: "no-repeat",  // prevent tiling 
      }}>
      <Paper
        elevation={6}
  className="p-6 w-[500px] border-double border-[15px]"
  sx={{
    backgroundColor: "rgba(0, 0, 0, 0.25)", // transparency level (0 = clear, 1 = solid)
    backdropFilter: "blur(5px)", // glass blur effect
    WebkitBackdropFilter: "blur(5px)", // Safari support
    borderColor: "rgba(100, 150, 100, 0.1)", // visible transparent white border
    color: "white",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)", // soft shadow for depth
  }}
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
  sx={{
    "& label": {
      color: "rgba(255, 255, 255, 0.6)", // default label color
    },
    "& label.Mui-focused": {
      color: "#FFD700", // 🌟 yellow when focused
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.4)", // normal
      },
      "&:hover fieldset": {
        borderColor: "#FFD700", // hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700", // focus (gold)
      },
    },
    input: { color: "white" },
  }}
/>

          <TextField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
  sx={{
    "& label": {
      color: "rgba(255, 255, 255, 0.6)", // default label color
    },
    "& label.Mui-focused": {
      color: "#FFD700", // 🌟 yellow when focused
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.4)", // normal
      },
      "&:hover fieldset": {
        borderColor: "#FFD700", // hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700", // focus (gold)
      },
    },
    input: { color: "white" },
  }}
          />

          <Button type="submit" variant="contained" className="!mt-4 !bg-yellow-500 !text-black !font-semibold hover:!bg-yellow-600">
            Login
          </Button>

          <Typography variant="body2" align="center" className="mt-4">
            New user?{" "}
            <Link to="/register" className="!text-yellow-400 hover:!text-yellow-600 hover:underline">
              Register
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
