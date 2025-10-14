'use client';

import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MateriaCardProps {
  materia: BoletaInscripcion;
}

export default function MateriaCard({ materia }: MateriaCardProps) {
  const getNotaColor = (nota?: number) => {
    if (nota === undefined) return 'text-gray-400';
    if (nota >= 70) return 'bg-green-100 text-green-700';
    if (nota >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getEstadoColor = (nota?: number) => {
    if (nota === undefined) return 'bg-gray-50 text-gray-600 border-gray-200';
    if (nota >= 70) return 'bg-green-50 text-green-700 border-green-200';
    if (nota >= 60) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getEstadoTexto = (nota?: number) => {
    if (nota === undefined) return 'EN CURSO';
    if (nota >= 70) return 'APROBADO';
    if (nota >= 60) return 'REGULAR';
    return 'REPROBADO';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">
          {materia.grupoMateria.materia.nombre}
        </CardTitle>
        <CardDescription>
          <span className="font-medium">Sigla:</span> {materia.grupoMateria.materia.sigla} | 
          <span className="font-medium"> Grupo:</span> {materia.grupoMateria.grupo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Créditos */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Créditos:</span>
            <span className="font-semibold text-blue-600">
              {materia.grupoMateria.materia.creditos}
            </span>
          </div>

          {/* Semestre */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Semestre:</span>
            <span className="font-semibold text-indigo-600">
              {materia.grupoMateria.materia.nivel.semestre}°
            </span>
          </div>

          {/* Nota */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nota:</span>
            {materia.nota !== undefined ? (
              <span className={`font-semibold px-2 py-1 rounded text-sm ${getNotaColor(materia.nota)}`}>
                {materia.nota}
              </span>
            ) : (
              <span className="text-gray-400 text-sm italic">Pendiente</span>
            )}
          </div>

          {/* Estado basado en la nota */}
          <div className="pt-2 border-t">
            <div className={`text-center py-1 px-2 rounded text-sm font-medium border ${getEstadoColor(materia.nota)}`}>
              {getEstadoTexto(materia.nota)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}