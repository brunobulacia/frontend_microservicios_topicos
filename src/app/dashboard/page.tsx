'use client';

import { useAuthStore } from '@/store/auth.store';
import { useInscripcionStore } from '@/store/inscripcion.store';
import ProtectedRoute from '@/components/ProtectedRoute';
import InscripcionActivaBanner from '@/components/InscripcionActivaBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Clock, AlertCircle } from 'lucide-react';

function DashboardContent() {
  const { user, maestroDeOferta, isHydrated } = useAuthStore();
  const { hasActiveInscripcion } = useInscripcionStore();
  const router = useRouter();

  const handleIniciarInscripcion = () => {
    if (maestroDeOferta && maestroDeOferta.length > 0 && maestroDeOferta[0]?.id) {
      router.push(`/grupo-materias/${maestroDeOferta[0].id}`);
    } else {
      console.error('No hay maestro de oferta disponible o falta ID');
    }
  };

  const handleVerBoleta = () => {
    router.push('/boleta-inscripcion');
  };

  // Mostrar loading mientras se hidrata
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Verificar si hay maestro de oferta disponible
  const hasMaestroDeOferta = maestroDeOferta && Array.isArray(maestroDeOferta) && maestroDeOferta.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="text-gray-600">
            Gestiona tus inscripciones académicas desde aquí
          </p>
        </div>

        {/* Banner de inscripción activa */}
        <InscripcionActivaBanner />

        {/* Acciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Inscribir materias */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-600" />
                Inscripción de Materias
              </CardTitle>
              <CardDescription>
                {hasActiveInscripcion() 
                  ? "Tienes una inscripción en proceso. No puedes iniciar una nueva hasta que termine."
                  : !hasMaestroDeOferta
                  ? "No hay oferta académica disponible en este momento."
                  : "Selecciona e inscribe las materias para este semestre"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleIniciarInscripcion}
                disabled={hasActiveInscripcion() || !hasMaestroDeOferta}
                className={`w-full ${
                  hasActiveInscripcion() || !hasMaestroDeOferta
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-slate-700 hover:bg-slate-800'
                } text-white`}
              >
                {hasActiveInscripcion() ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Inscripción en proceso
                  </>
                ) : !hasMaestroDeOferta ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    No hay oferta disponible
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Iniciar Inscripción
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Ver boleta */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Mi Boleta de Inscripción
              </CardTitle>
              <CardDescription>
                Revisa las materias en las que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleVerBoleta}
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Ver Boleta
              </Button>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}