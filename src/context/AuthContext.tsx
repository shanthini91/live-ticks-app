// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Utility: Add to history
  const logHistory = (email: string, action: string) => {
    const key = `history_${email}`;
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    history.push({ action, time: new Date().toLocaleString() });
    localStorage.setItem(key, JSON.stringify(history));
  };

  const login = (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const existing = users.find((u) => u.email === email && u.password === password);
    if (existing) {
      localStorage.setItem("user", JSON.stringify(existing));
      setUser(existing);
      logHistory(email, "Login");
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) return false;

    const newUser: User = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    logHistory(email, "Registration");
    return true;
  };

  const logout = () => {
    if (user) logHistory(user.email, "Logout");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
