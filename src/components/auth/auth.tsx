'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { login } from '@/api/auth';
import LoginDto from '@/types/login.dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginDto>({
    registro: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setAuthData, token, maestroDeOferta } = useAuthStore();
  const router = useRouter();

  // Si ya está autenticado, redirigir automáticamente
  useEffect(() => {
    if (token && maestroDeOferta && Array.isArray(maestroDeOferta) && maestroDeOferta.length > 0) {
      router.replace(`/grupo-materias/${maestroDeOferta[0].id}`);
    }
  }, [token, maestroDeOferta, router]);

  // Si ya está autenticado, mostrar loading mientras redirige
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting login with data:', formData); // Debug log
      const response = await login(formData);
      console.log('Login response:', response); // Debug log
      
      // Verificar que la respuesta tenga la estructura esperada
      const maestroData = response.MaestroDeOferta || response.maestroDeOferta;
      if (!maestroData || !Array.isArray(maestroData) || maestroData.length === 0) {
        throw new Error('No se encontró información del maestro de oferta');
      }

      setAuthData(response);
      
      // Usar replace para evitar problemas de navegación
      await router.replace(`/grupo-materias/${maestroData[0].id}`);
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setIsLoading(false); // Solo resetear loading en caso de error
    }
    // No resetear loading aquí - se maneja en el useEffect o en el error
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginDto) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registro">Matrícula</Label>
              <Input
                id="registro"
                name="registro"
                type="text"
                required
                value={formData.registro}
                onChange={handleChange}
                placeholder="223041866"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}