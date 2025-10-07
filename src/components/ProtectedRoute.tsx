// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  // If user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, render the protected children
  return <>{children}</>;
};

export default ProtectedRoute;
