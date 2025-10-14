"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { token, user, clearAuthData } = useAuthStore();
  const router = useRouter();

  const logout = () => {
    clearAuthData();
    router.push("/login");
  };

  const requireAuth = () => {
    if (!token) {
      router.push("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Verificar si el token está expirado (opcional)
    if (token) {
      try {
        // Si el token es JWT, puedes decodificarlo y verificar la expiración
        // const payload = JSON.parse(atob(token.split('.')[1]));
        // if (payload.exp * 1000 < Date.now()) {
        //   logout();
        // }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    }
  }, [token]);

  return {
    token,
    user,
    logout,
    requireAuth,
    isAuthenticated: !!token,
    isLoading: false, // Puedes agregar lógica de loading si es necesario
  };
}
