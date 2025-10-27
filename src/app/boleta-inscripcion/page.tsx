"use client";
import { getMateriasInscritas } from "@/api/boletaInscripcion";
import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import ProtectedRoute from "@/components/ProtectedRoute";
import MateriaCard from "@/components/MateriaCard";

function BoletaContent() {
  const { user } = useAuthStore();
  const [materias, setMaterias] = useState<BoletaInscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoleta = async () => {
      try {
        setLoading(true);
        if (user) {
          const data = await getMateriasInscritas(user.id.toString());
          console.log('Datos de boleta:', data);
          setMaterias(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error al cargar boleta:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoleta();
  }, [user?.registro]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando boleta de inscripción...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Agrupar materias por semestre
  const materiasPorSemestre = materias.reduce((acc, materia) => {
    const semestre = materia.materia.nivel.semestre;
    if (!acc[semestre]) {
      acc[semestre] = [];
    }
    acc[semestre].push(materia);
    return acc;
  }, {} as Record<number, BoletaInscripcion[]>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Boleta de Inscripción
        </h1>
        <p className="text-gray-600">
          Estudiante: {user?.nombre} {user?.apellido_paterno} {user?.apellido_materno}
        </p>
        <p className="text-gray-500 text-sm">
          Matrícula: {user?.registro}
        </p>
      </div>


      {/* Materias por Semestre */}
      {Object.keys(materiasPorSemestre).length > 0 ? (
        Object.entries(materiasPorSemestre)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([semestre, materiasDelSemestre]) => (
            <div key={semestre} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {parseInt(semestre)}° Semestre
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materiasDelSemestre.map((materia) => (
                  <MateriaCard key={materia.id} materia={materia} />
                ))}
              </div>
            </div>
          ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay materias inscritas</h3>
          <p className="text-gray-500">Aún no tienes materias registradas en tu boleta de inscripción.</p>
        </div>
      )}
    </div>
  );
}

export default function BoletaInscripcionPage() {
  return (
    <ProtectedRoute>
      <BoletaContent />
    </ProtectedRoute>
  );
}
