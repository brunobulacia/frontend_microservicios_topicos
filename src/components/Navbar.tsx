'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Sistema de Inscripciones
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Bienvenido, {user?.nombre} {user?.apellido_paterno}
            </span>
            
            <div className="text-xs text-gray-500">
              Matrícula: {user?.matricula}
            </div>
            
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}