"use client"

import { getInscripcionAsync } from "@/api/inscripcion-async";
import { getOfertaGrupoMateria } from "@/api/ofertaGrupoMateria";
import { InscribirEstudiante } from "@/types/inscribir-estudiante";
import { OfertaGrupoMateria } from "@/types/oferta-grupo-materia.dto";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";



export default function GrupoMateriasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [ofertasGrupoMateria, setOfertasGrupoMateria] = useState<OfertaGrupoMateria[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);


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

    const data: InscribirEstudiante = {
      registro: '223041866',
      materiasId: selectedIds
    };
    const result = await getInscripcionAsync(data);
    console.log('Resultado de la inscripción:', result);

  }

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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ofertas de Grupo Materia</h1>
          
          {/* Controles de selección */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {selectedIds.length === ofertasGrupoMateria.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
            
            {selectedIds.length > 0 && (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {ofertasGrupoMateria.map((oferta) => (
            <div 
              key={oferta.id} 
              className={`bg-white shadow-md rounded-lg p-6 border-l-4 transition-all ${
                selectedIds.includes(oferta.grupoMateriaId) 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-blue-500 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    id={`checkbox-${oferta.grupoMateriaId}`}
                    checked={selectedIds.includes(oferta.grupoMateriaId)}
                    onChange={() => handleCheckboxChange(oferta.grupoMateriaId)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                
                {/* Contenido de la card */}
                <div className="flex-grow">
                  <div className="mb-4">
                    <label 
                      htmlFor={`checkbox-${oferta.id}`}
                      className="cursor-pointer"
                    >
                      <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                        {oferta.GrupoMateria.materia.nombre}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">Grupo: {oferta.GrupoMateria.grupo}</p>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Cupos disponibles:</span> {oferta.GrupoMateria.cupos}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Información de selección y debug */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <span className="font-semibold">Total de ofertas:</span> {ofertasGrupoMateria.length}
            </p>
          </div>
          

            <button
              onClick={handleConfirmSelection}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Confirmar selección
            </button>

        </div>
      </div>
    );
}
