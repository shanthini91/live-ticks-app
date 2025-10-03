// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type User = {
  name: string;
  email: string;
  password: string; // store hashed password in real app
};

type AuthContextType = {
  user: Omit<User, "password"> | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const navigate = useNavigate();

  const getRegisteredUsers = (): User[] => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: User[]) => localStorage.setItem("users", JSON.stringify(users));

  const register = async (name: string, email: string, password: string) => {
    const users = getRegisteredUsers();
    if (users.find(u => u.email === email)) return false; // email exists

    const newUser: User = { name, email, password };
    users.push(newUser);
    saveUsers(users);

    setUser({ name, email });
    return true;
  };

  const login = async (email: string, password: string) => {
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email === email && u.password === password);
    if (!existing) return false;

    setUser({ name: existing.name, email: existing.email });
    return true;
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
