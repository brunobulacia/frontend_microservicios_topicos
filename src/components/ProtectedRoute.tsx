'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { token, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si ya se hidró y no hay token
    if (isHydrated && !token) {
      router.push('/');
    }
  }, [token, isHydrated, router]);

  // Mostrar loading mientras se hidrata o si no hay token pero aún se está hidratando
  if (!isHydrated || (!token && isHydrated)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-slate-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}