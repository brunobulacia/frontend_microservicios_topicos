"use client"

import { getOfertaGrupoMateria } from "@/api/ofertaGrupoMateria";
import { OfertaGrupoMateria } from "@/types/oferta-grupo-materia.dto";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInscripcionAsync } from "@/hooks/useInscripcionAsync";
import InscripcionProgress from "@/components/InscripcionProgress";

function GrupoMateriasContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [ofertasGrupoMateria, setOfertasGrupoMateria] = useState<OfertaGrupoMateria[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  // Hook para manejar inscripciones asíncronas
  const {
    isProcessing,
    jobStatus,
    success,
    error: inscripcionError,
    iniciarInscripcion,
    cancelarInscripcion,
    cleanup,
  } = useInscripcionAsync();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { slug } = resolvedParams;
        
        const data: OfertaGrupoMateria[] = await getOfertaGrupoMateria(slug);
        
        console.log('Datos recibidos:', data);
        console.log('Token de autenticación:', token);
        // Verificar que recibimos un array con datos
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No se encontraron ofertas para este maestro de oferta');
        }
        
        setOfertasGrupoMateria(data);
      } catch (err) {
        console.error('Error al cargar la oferta:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  // Cleanup del polling al desmontar el componente
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Limpiar selección cuando la inscripción sea exitosa
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSelectedIds([]);
      }, 3000);
    }
  }, [success]);

  // Handler para manejar la selección de checkboxes
  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        // Si ya está seleccionado, lo removemos
        return prev.filter(selectedId => selectedId !== id);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prev, id];
      }
    });
  };
  const handleConfirmSelection = async () => {
    if (selectedIds.length === 0) return;
    
    // Usar el hook para iniciar la inscripción asíncrona
    await iniciarInscripcion(selectedIds);
  };

  // Handler para seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selectedIds.length === ofertasGrupoMateria.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedIds([]);
    } else {
      // Si no todos están seleccionados, seleccionar todos
      setSelectedIds(ofertasGrupoMateria.map(oferta => oferta.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando ofertas académicas...</p>
              <p className="text-gray-500 text-sm mt-2">Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                Error al cargar las ofertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    Ofertas Académicas
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Selecciona las materias que deseas inscribir este semestre
                  </p>
                </div>
                
                {/* <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    className="bg-white/50 hover:bg-white/70 border-blue-200"
                  >
                    {selectedIds.length === ofertasGrupoMateria.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </Button>
                  
                  {selectedIds.length > 0 && (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        
        {/* Grid de materias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {ofertasGrupoMateria.map((oferta) => (
            <Card 
              key={oferta.id} 
              className={`transition-all duration-300 cursor-pointer hover:shadow-xl border-2 ${
                selectedIds.includes(oferta.grupoMateriaId) 
                  ? 'border-green-400 bg-green-50/50 shadow-lg ring-2 ring-green-200' 
                  : 'border-gray-200 bg-white/80 hover:border-blue-300'
              } backdrop-blur-sm`}
              onClick={() => handleCheckboxChange(oferta.grupoMateriaId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-800 mb-2 flex items-center gap-2">
                      <span>📖</span>
                      {oferta.GrupoMateria.materia.nombre}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Grupo {oferta.GrupoMateria.grupo}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          oferta.GrupoMateria.cupos >= 10 
                            ? 'bg-green-100 text-green-700' 
                            : oferta.GrupoMateria.cupos > 5 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {oferta.GrupoMateria.cupos} cupos
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedIds.includes(oferta.grupoMateriaId)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {selectedIds.includes(oferta.grupoMateriaId) && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cupos disponibles:</span>
                    <span className={`font-semibold ${
                      oferta.GrupoMateria.cupos > 10 
                        ? 'text-green-600' 
                        : oferta.GrupoMateria.cupos > 5 
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {oferta.GrupoMateria.cupos}
                    </span>
                  </div>
                  
                  {/* Indicador de selección */}
                  {selectedIds.includes(oferta.grupoMateriaId) && (
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <span>✅</span>
                      <span>Seleccionada para inscripción</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Componente de progreso de inscripción */}
        {isProcessing && (
          <div className="mb-6">
            <InscripcionProgress 
              jobStatus={jobStatus}
              isProcessing={isProcessing}
              selectedCount={selectedIds.length}
            />
          </div>
        )}

        {/* Mensaje de error */}
        {(error || inscripcionError) && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-red-700">
                  <span className="text-xl">❌</span>
                  <div>
                    <p className="font-medium">Error en la inscripción</p>
                    <p className="text-sm text-red-600">{error || inscripcionError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Panel de resumen y acciones */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Resumen de selección
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  <strong>{ofertasGrupoMateria.length}</strong> materias disponibles
                </span>
                <span>•</span>
                <span>
                  <strong>{selectedIds.length}</strong> seleccionadas
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isProcessing && (
                <Button
                  onClick={cancelarInscripcion}
                  variant="outline"
                  className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancelar
                </Button>
              )}
              
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedIds.length === 0 || isProcessing}
                className={`px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                  success 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : isProcessing
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {jobStatus?.status === 'queued' || jobStatus?.status === 'pending' ? 'En cola...' : 
                     jobStatus?.status === 'waiting' ? 'Procesando...' : 'Iniciando...'}
                  </div>
                ) : success ? (
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    ¡Inscripción exitosa!
                  </div>
                ) : selectedIds.length === 0 ? (
                  'Selecciona materias'
                ) : (
                  `Confirmar inscripción (${selectedIds.length})`
                )}
              </Button>
            </div>
          </div>
        </div>
        
        </div>
      </div>
    );
}

export default function GrupoMateriasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <ProtectedRoute>
      <GrupoMateriasContent params={params} />
    </ProtectedRoute>
  );
}
