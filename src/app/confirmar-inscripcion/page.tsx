"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfertaGrupoMateria } from "@/types/oferta-grupo-materia.dto";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getInscripcionAsync } from "@/api/inscripcion-async";
import { useAuthStore } from "@/store/auth.store";

function ConfirmarInscripcionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<OfertaGrupoMateria[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Recuperar las materias seleccionadas del localStorage
    const materias = localStorage.getItem('materiasSeleccionadas');
    if (materias) {
      try {
        const materiasParseadas: OfertaGrupoMateria[] = JSON.parse(materias);
        setMateriasSeleccionadas(materiasParseadas);
      } catch (error) {
        console.error('Error al parsear materias seleccionadas:', error);
        router.push('/'); // Redirigir si hay error
      }
    } else {
      // Si no hay materias seleccionadas, redirigir
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleConfirmarInscripcion = async () => {
    if (materiasSeleccionadas.length === 0 || !user?.id) return;
    
    setProcesando(true);
    
    try {
      // Preparar los datos para la API
      const idsSeleccionados = materiasSeleccionadas.map(materia => materia.id);
      
      const inscripcionData = {
        registro: user.registro,
        ofertaId: idsSeleccionados
      };
      
      console.log('Iniciando inscripción con datos:', inscripcionData);
      
      // Llamar a la API de inscripción async
      const response = await getInscripcionAsync(inscripcionData);
      
      console.log('Respuesta de inscripción:', response);
      
      // Guardar el jobId y los datos en localStorage para la página de estado
      localStorage.setItem('inscripcionTaskId', response.jobId);
      localStorage.setItem('materiasInscripcion', JSON.stringify(materiasSeleccionadas));
      
      // Limpiar las materias seleccionadas
      localStorage.removeItem('materiasSeleccionadas');
      
      // Redirigir a la página de estado
      router.push(`/estado-inscripcion?taskId=${response.jobId}`);
      
    } catch (error) {
      console.error('Error al iniciar inscripción:', error);
      setProcesando(false);
      // Aquí podrías mostrar un mensaje de error si quieres
    }
  };

  const handleVolver = () => {
    router.back();
  };

  const calcularTotalCreditos = () => {
    return materiasSeleccionadas.reduce((total, materia) => 
      total + materia.detalleGrupoMateria.materia.creditos, 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando confirmación...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (materiasSeleccionadas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                No hay materias seleccionadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                No se encontraron materias para inscribir. Por favor, vuelve a seleccionar las materias.
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl">📋</span>
                Confirmar Inscripción
              </h1>
              <p className="text-gray-600">
                Revisa las materias seleccionadas antes de confirmar tu inscripción
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de materias */}
        <div className="mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                Resumen de Inscripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{materiasSeleccionadas.length}</p>
                  <p className="text-sm text-gray-600">Materias seleccionadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{calcularTotalCreditos()}</p>
                  <p className="text-sm text-gray-600">Créditos totales</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{user?.nombre || 'Usuario'}</p>
                  <p className="text-sm text-gray-600">Estudiante</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de materias seleccionadas */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Materias a inscribir:</h2>
          
          {materiasSeleccionadas.map((materia, index) => {
            const detalle = materia.detalleGrupoMateria;
            const aula = detalle.AulaGrupoMateria[0];
            const nombreDocente = `${detalle.Docente.nombre} ${detalle.Docente.apellido_paterno} ${detalle.Docente.apellido_materno}`;
            
            return (
              <Card key={materia.id} className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 mb-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        {detalle.materia.nombre}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {detalle.materia.sigla}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Grupo {detalle.grupo}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {detalle.materia.creditos} créditos
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          Semestre {detalle.materia.nivel.semestre}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Columna izquierda: Docente y Aula */}
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-600 font-medium">👨‍🏫 Docente:</span>
                        <p className="text-gray-800 font-medium">{nombreDocente}</p>
                      </div>
                      
                      {aula && (
                        <div className="text-sm">
                          <span className="text-gray-600 font-medium">🏫 Aula:</span>
                          <p className="text-gray-800 font-semibold">Aula {aula.aula.numero}</p>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="text-gray-600">Cupos disponibles:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {detalle.inscritos} / {detalle.cupos}
                        </span>
                      </div>
                    </div>
                    
                    {/* Columna derecha: Horario */}
                    {aula && (
                      <div className="text-sm">
                        <span className="text-gray-600 font-medium">🕐 Horario:</span>
                        <div className="mt-1 space-y-1">
                          {aula.horario.map((horario, idx) => (
                            <div key={idx} className="text-xs text-gray-700 bg-gray-50 p-2 rounded flex justify-between">
                              <span className="font-medium">{horario.diaSemana}</span>
                              <span>{horario.horaInicio} - {horario.horaFin}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            onClick={handleVolver}
            variant="outline"
            className="px-8 py-3 bg-white/50 hover:bg-white/70 border-gray-300"
            disabled={procesando}
          >
            ← Volver a selección
          </Button>
          
          <Button
            onClick={handleConfirmarInscripcion}
            disabled={procesando}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {procesando ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Iniciando inscripción...
              </div>
            ) : (
              <>
                ✅ Confirmar inscripción ({materiasSeleccionadas.length} materias)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmarInscripcionPage() {
  return (
    <ProtectedRoute>
      <ConfirmarInscripcionContent />
    </ProtectedRoute>
  );
}