import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponseDto } from "@/types/login-response.dto";

interface AuthState {
  token: LoginResponseDto["access_token"] | null;
  user: Omit<LoginResponseDto, "access_token"> | null;
  setAuthData: (data: LoginResponseDto) => void;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuthData: (data) =>
        set({
          token: data.access_token,
          user: {
            id: data.id,
            nombre: data.nombre,
            email: data.email,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            telefono: data.telefono,
            ci: data.ci,
            matricula: data.matricula,
            ppac: data.ppac,
          },
        }),
      clearAuthData: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth", // storage key for persist middleware
    }
  )
);
