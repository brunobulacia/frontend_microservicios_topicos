import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://18.228.137.177:3000/api/";
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      useAuthStore.getState().clearAuthData();
      // Solo redirigir si estamos en el cliente
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
