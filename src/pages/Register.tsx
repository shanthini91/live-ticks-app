// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate("/login");
    else setError("Email already registered");
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-900">


    <Paper
  elevation={6}
  className="p-6 w-[350px] !bg-yellow-500 text-black rounded-xl shadow-lg"
>
  <Typography variant="h5" align="center" gutterBottom>
    Register
  </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Register
          </Button>
        </form>
        <Typography mt={2} variant="body2" textAlign="center">
          Already have an account?{" "}
<Link
  component={RouterLink}
  to="/login"
  className="!text-gray-700 hover:!text-gray-900 hover:underline"
>
  Login
</Link>

        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
