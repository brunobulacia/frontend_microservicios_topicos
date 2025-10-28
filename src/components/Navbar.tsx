'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, Home, FileText, User, LogOut, Menu, X, NotebookText } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // No mostrar navbar durante la carga o si no está autenticado
  if (isLoading || !isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Mi Boleta', href: '/boleta-inscripcion', icon: FileText },
    {name : 'Mi Avance', href: '/avance-academico', icon: NotebookText}
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-white/10 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Sistema de Inscripciones
                </h1>
                <p className="text-xs text-slate-300 hidden sm:block">
                  Universidad Autonoma Gabriel René Moreno
                </p>
              </div>
            </Link>
            
            {/* Navegación desktop */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Información del usuario y controles */}
          <div className="flex items-center space-x-4">
            {/* Info del usuario - desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user?.nombre} {user?.apellido_paterno}
                </p>
                <p className="text-xs text-blue-100">
                  Registro: {user?.registro}
                </p>
              </div>
            </div>

            {/* Botón de logout */}
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              <div className="hidden sm:flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </div>
              <LogOut className="w-4 h-4 sm:hidden" />
            </Button>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-blue-800">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Info del usuario en móvil */}
              <div className="px-3 py-2 border-t border-blue-800 mt-2">
                <p className="text-sm font-medium text-white">
                  {user?.nombre} {user?.apellido_paterno}
                </p>
                <p className="text-xs text-blue-100">
                  Registro: {user?.registro}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}