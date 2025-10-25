"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfertaGrupoMateria } from "@/types/oferta-grupo-materia.dto";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getInscripcionStatus } from "@/api/inscripcion-async";
import { useAuthStore } from "@/store/auth.store";
import { useInscripcionStore } from "@/store/inscripcion.store";
import { AlertCircle, BarChart3, BookOpen, RotateCcw, CheckCircle, XCircle, Clock, Loader, FileText, Home } from 'lucide-react';

type JobStatus = 'completed' | 'waiting' | 'active' | 'delayed' | 'failed' | 'paused';

type JobResponse = {
  jobId: string;
  queueName: string;
  status: JobStatus;
  data: {
    registro: string;
    ofertaId: string[];
  };
  progress: number;
  createdAt: string;
  processedOn?: string;
  finishedOn?: string;
  returnValue?: {
    message: string;
    [key: string]: any;
  };
  attemptsMade: number;
  opts: {
    attempts: number;
    delay: number;
  };
  failedReason?: string;
};

function EstadoInscripcionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobId, setJobId] = useState<string | null>(null);
  const [materiasInscripcion, setMateriasInscripcion] = useState<OfertaGrupoMateria[]>([]);
  const [jobResponse, setJobResponse] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const { updateJobStatus, clearActiveInscripcion } = useInscripcionStore();

  useEffect(() => {
    // Obtener jobId de los query params o localStorage
    const jobIdFromParams = searchParams.get('taskId'); // Mantenemos 'taskId' por compatibilidad con URLs existentes
    const jobIdFromStorage = localStorage.getItem('inscripcionTaskId'); // Mantenemos el nombre por compatibilidad
    const currentJobId = jobIdFromParams || jobIdFromStorage;

    if (currentJobId) {
      setJobId(currentJobId);
      
      // Obtener las materias de inscripción
      const materiasStr = localStorage.getItem('materiasInscripcion');
      if (materiasStr) {
        try {
          const materias: OfertaGrupoMateria[] = JSON.parse(materiasStr);
          setMateriasInscripcion(materias);
        } catch (error) {
          console.error('Error al parsear materias de inscripción:', error);
        }
      }
    } else {
      // Si no hay jobId, redirigir al inicio
      router.push('/');
      return;
    }
    
    setLoading(false);
  }, [searchParams, router]);

  // Función para hacer polling del estado
  const pollJobStatus = async (currentJobId: string) => {
    try {
      const response = await getInscripcionStatus(currentJobId);
      setJobResponse(response);
      
      // Actualizar el store con el nuevo estado
      updateJobStatus(response.status);
      
      // Si el job está completado o falló, detener el polling
      if (response.status === 'completed' || response.status === 'failed') {
        setPolling(false);
        
        // Si está completado o falló, limpiar la inscripción activa después de un tiempo
        if (response.status === 'completed') {
          setTimeout(() => {
            clearActiveInscripcion();
          }, 30000); // Limpiar después de 30 segundos para dar tiempo a ver el resultado
        } else if (response.status === 'failed') {
          // Para errores, limpiar inmediatamente para permitir nuevos intentos
          clearActiveInscripcion();
        }
        
        if (response.status === 'completed') {
          // Limpiar localStorage después de completar
          localStorage.removeItem('inscripcionTaskId');
          localStorage.removeItem('materiasInscripcion');
        }
      }
    } catch (error) {
      console.error('Error al obtener estado del job:', error);
      setError('Error al verificar el estado de la inscripción');
      setPolling(false);
    }
  };

  // Iniciar polling cuando se carga el componente
  useEffect(() => {
    if (jobId && !loading) {
      setPolling(true);
      // Primera verificación inmediata
      pollJobStatus(jobId);
    }
  }, [jobId, loading]);

  // Intervalo de polling
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (polling && jobId) {
      intervalId = setInterval(() => {
        pollJobStatus(jobId);
      }, 2000); // Polling cada 2 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [polling, jobId]);

  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case 'delayed':
      case 'paused':
        return {
          icon: <Clock className="w-6 h-6" />,
          title: 'En cola',
          description: 'Tu inscripción está en cola de procesamiento',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'waiting':
      case 'active':
        return {
          icon: <Loader className="w-6 h-6 animate-spin" />,
          title: 'Procesando',
          description: 'Estamos procesando tu inscripción',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          title: '¡Inscripción exitosa!',
          description: 'Tu inscripción se ha completado correctamente',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-6 h-6" />,
          title: 'Inscripción fallida',
          description: 'Ocurrió un error durante la inscripción',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          title: 'Estado desconocido',
          description: 'No se pudo determinar el estado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const handleVerBoleta = () => {
    router.push('/boleta-inscripcion');
  };

  const handleVolverInicio = () => {
    // Navegar al dashboard, manteniendo la inscripción activa si no está completa
    router.push('/dashboard');
  };

  const handleIntentarDeNuevo = () => {
    // Limpiar datos y volver a la selección
    localStorage.removeItem('inscripcionTaskId');
    localStorage.removeItem('materiasInscripcion');
    clearActiveInscripcion();
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando estado de inscripción...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = jobResponse ? getStatusInfo(jobResponse.status) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-slate-600" />
                Estado de Inscripción
              </h1>
              <p className="text-gray-600">
                Seguimiento en tiempo real de tu proceso de inscripción
              </p>
              {jobId && (
                <p className="text-sm text-gray-500 mt-2">
                  ID de seguimiento: <code className="bg-gray-100 px-2 py-1 rounded">{jobId}</code>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estado actual */}
        {statusInfo && (
          <div className="mb-8">
            <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className={`${statusInfo.color} flex items-center gap-3 text-xl`}>
                  <span className="text-3xl">{statusInfo.icon}</span>
                  {statusInfo.title}
                </CardTitle>
                <CardDescription className="text-gray-700">
                  {statusInfo.description}
                </CardDescription>
              </CardHeader>
              
              {/* Progress bar para estados en proceso */}
              {jobResponse && (jobResponse.status === 'delayed' || jobResponse.status === 'paused' || jobResponse.status === 'waiting' || jobResponse.status === 'active') && (
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse" 
                      style={{ width: `${Math.max(jobResponse.progress || 0, 20)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {polling ? 'Verificando estado...' : 'Estado actualizado'} 
                    {jobResponse.progress > 0 && ` - ${jobResponse.progress}%`}
                  </p>
                </CardContent>
              )}

              {/* Mostrar resultado si está completado */}
              {jobResponse && jobResponse.status === 'completed' && jobResponse.returnValue && (
                <CardContent>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Resultado de la inscripción:</h4>
                    <div className="space-y-2">
                      <p className="text-green-700 font-medium">{jobResponse.returnValue.message}</p>
                      {jobResponse.finishedOn && (
                        <p className="text-sm text-green-600">
                          Completado el: {new Date(jobResponse.finishedOn).toLocaleString()}
                        </p>
                      )}
                      <div className="text-sm text-green-600">
                        <p>Materias inscritas: {jobResponse.data.ofertaId.length}</p>
                        <p>Registro: {jobResponse.data.registro}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}

              {/* Mostrar error si falló */}
              {jobResponse && jobResponse.status === 'failed' && (
                <CardContent>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Error en la inscripción:</h4>
                    <p className="text-red-700">
                      {jobResponse.failedReason || 'Error desconocido durante la inscripción'}
                    </p>
                    {jobResponse.attemptsMade > 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        Intentos realizados: {jobResponse.attemptsMade} de {jobResponse.opts.attempts}
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {/* Error de conexión */}
        {error && (
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Error de conexión</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resumen de materias (si están disponibles) */}
        {materiasInscripcion.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  Materias en proceso ({materiasInscripcion.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materiasInscripcion.map((materia, index) => {
                    const detalle = materia.detalleGrupoMateria;
                    return (
                      <div key={materia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800">{detalle.materia.nombre}</p>
                            <p className="text-sm text-gray-600">{detalle.materia.sigla} - Grupo {detalle.grupo}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {detalle.materia.creditos} créditos
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {jobResponse?.status === 'completed' && (
            <>
              <Button
                onClick={handleVerBoleta}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver mi boleta de inscripción
              </Button>
              <Button
                onClick={handleVolverInicio}
                variant="outline"
                className="px-6 py-3 border-gray-300 hover:bg-gray-50"
              >
                Volver al inicio
              </Button>
            </>
          )}

          {jobResponse?.status === 'failed' && (
            <>
              <Button
                onClick={handleIntentarDeNuevo}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              <Button
                onClick={handleVolverInicio}
                variant="outline"
                className="px-6 py-3 border-gray-300 hover:bg-gray-50"
              >
                Volver al inicio
              </Button>
            </>
          )}

          {(jobResponse?.status === 'delayed' || jobResponse?.status === 'paused' || jobResponse?.status === 'waiting' || jobResponse?.status === 'active') && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Por favor espera mientras procesamos tu inscripción. No cierres esta página.
              </p>
              <Button
                onClick={handleVolverInicio}
                variant="outline"
                className="px-6 py-3 border-gray-300 hover:bg-gray-50"
                disabled={polling}
              >
                <Home className="w-4 h-4 mr-2" />
                Cancelar y volver al inicio
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EstadoInscripcionPage() {
  return (
    <ProtectedRoute>
      <EstadoInscripcionContent />
    </ProtectedRoute>
  );
}