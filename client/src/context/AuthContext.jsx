// context/AuthContext.jsx - Auth state (user + token) with login/register/logout/profile updates

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore the session using the saved token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, phone: data.phone, role: data.role });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, phone: data.phone, role: data.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Merge updated profile fields into current user state
  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can do: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
