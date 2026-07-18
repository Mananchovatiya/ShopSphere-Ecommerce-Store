// services/api.js - Axios instance with base URL + auth token injection

import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite proxies to http://localhost:5000
});

// Attach JWT token from localStorage on every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
