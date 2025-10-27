"use client"

import { getOfertaGrupoMateria } from "@/api/ofertaGrupoMateria";
import { OfertaGrupoMateria } from "@/types/oferta-grupo-materia.dto";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, ArrowRight, CheckSquare, User, MapPin, Clock } from 'lucide-react';

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
  
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { slug } = resolvedParams;
        
        const data: OfertaGrupoMateria[] = await getOfertaGrupoMateria(slug);
        
        console.log('Datos recibidos:', data);
        console.log('Token de autenticación:', token);
        
        // Si no hay datos, simplemente seteamos un array vacío
        setOfertasGrupoMateria(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar la oferta:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);



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
    
    // Obtener las materias completas seleccionadas
    const materiasSeleccionadas = ofertasGrupoMateria.filter(oferta => 
      selectedIds.includes(oferta.id)
    );
    
    console.log('Materias seleccionadas para confirmar:', materiasSeleccionadas);
    
    // Guardar en localStorage para la página de confirmación
    localStorage.setItem('materiasSeleccionadas', JSON.stringify(materiasSeleccionadas));
    
    // Redirigir a la página de confirmación
    router.push('/confirmar-inscripcion');
  };

  // Handler para seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    // Obtener todos los IDs de ofertas disponibles
    const todasLasOfertas = ofertasGrupoMateria.map(oferta => oferta.id);

    if (selectedIds.length === todasLasOfertas.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedIds([]);
    } else {
      // Si no todos están seleccionados, seleccionar todos
      setSelectedIds(todasLasOfertas);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-4"></div>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Error al cargar las ofertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{}</p>
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

  // Mostrar mensaje cuando no hay materias disponibles
  if (!loading && ofertasGrupoMateria.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-700 flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-green-600" />
                ¡Felicitaciones!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Has completado todas tus inscripciones
                </h3>
                <p className="text-gray-600 mb-6">
                  No hay más materias disponibles para inscribir en este período académico.
                </p>
                <Button 
                  onClick={() => window.history.back()} 
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Volver atrás
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-slate-600" />
                    Ofertas Académicas
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Selecciona las materias que deseas inscribir este semestre
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    {selectedIds.length === ofertasGrupoMateria.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </Button>
                  
                  {selectedIds.length > 0 && (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        
        {/* Grid de materias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {ofertasGrupoMateria.map((oferta) => {
            const detalle = oferta.detalleGrupoMateria;
            const aula = detalle.AulaGrupoMateria[0]; // Tomamos la primera aula
            const nombreDocente = `${detalle.Docente.nombre} ${detalle.Docente.apellido_paterno} ${detalle.Docente.apellido_materno}`;
            
            return (
            <Card 
              key={oferta.id} 
              className={`transition-all duration-300 cursor-pointer hover:shadow-xl border-2 ${
                selectedIds.includes(oferta.id) 
                  ? 'border-green-400 bg-green-50/50 shadow-lg ring-2 ring-green-200' 
                  : 'border-gray-200 bg-white/80 hover:border-blue-300'
              } backdrop-blur-sm`}
              onClick={() => handleCheckboxChange(oferta.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-800 mb-2 flex items-center gap-2">
                      <span>📖</span>
                      {detalle.materia.nombre}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {detalle.materia.sigla}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Grupo {detalle.grupo}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          detalle.cupos >= 10 
                            ? 'bg-green-100 text-green-700' 
                            : detalle.cupos > 5 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {detalle.cupos} cupos
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {detalle.materia.creditos} créditos
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        Semestre {detalle.materia.nivel.semestre}
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedIds.includes(oferta.id)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {selectedIds.includes(oferta.id) && (
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
                  {/* Información del docente */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Docente:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {nombreDocente}
                    </span>
                  </div>
                  
                  {/* Información del aula y horario */}
                  {aula && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Aula:
                        </span>
                        <span className="text-gray-800 font-semibold">
                          Aula {aula.aula.numero}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-600 font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Horario:
                        </span>
                        <div className="mt-1 space-y-1">
                          {aula.horario.map((horario, index) => (
                            <div key={index} className="text-xs text-gray-700 bg-gray-50 p-2 rounded flex justify-between">
                              <span className="font-medium">{horario.diaSemana}</span>
                              <span>{horario.horaInicio} - {horario.horaFin}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Estado de inscripción e inscritos */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Inscritos actuales:</span>
                    <span className="font-semibold text-gray-800">
                      {detalle.inscritos} / {detalle.cupos}
                    </span>
                  </div>
                  
                  {/* Indicador de selección */}
                  {selectedIds.includes(oferta.id) && (
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 p-2 rounded border border-green-200">
                      <CheckSquare className="w-4 h-4" />
                      <span>Seleccionada para inscripción</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
        


        {/* Panel de resumen y acciones */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedIds.length === 0}
                className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-slate-700 hover:bg-slate-800 text-white"
              >
                {selectedIds.length === 0 ? (
                  'Selecciona materias'
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continuar con {selectedIds.length} materia{selectedIds.length !== 1 ? 's' : ''}
                  </>
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
