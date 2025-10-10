"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import LoginDto from "@/types/login.dto";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AuthPage() {
  const { register, handleSubmit } = useForm<LoginDto>();
  const router = useRouter();
  const setAuthData = useAuthStore((state) => state.setAuthData);


  const onSubmit = async (data: LoginDto) => {
    try {
      const response = await login(data);
      setAuthData(response);
      console.log(response);
      if (response) {
        router.push(`/grupo-materias/${response.MaestroDeOferta[0].id}`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sistema de Inscripcion Universitario</CardTitle>
          <CardDescription>
            Introduzca sus credenciales para iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="registro">Registro</Label>
                <Input
                  id="registro"
                  type="text"
                  placeholder="Ej: 20123456"
                  required
                  {...register("matricula")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
