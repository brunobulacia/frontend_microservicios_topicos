'use client';

import { BoletaInscripcion } from '@/types/boleta-inscripcion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { BookOpen, Target, Users, BarChart3 } from 'lucide-react'

interface EstadisticasProps {
  materias: BoletaInscripcion[];
}

export default function EstadisticasBoleta({ materias }: EstadisticasProps) {
  // Cálculos
  const totalCreditos = materias.reduce((sum, materia) => sum + materia.materia.creditos, 0);
  const totalInscritos = materias.reduce((sum, materia) => sum + materia.inscritos, 0);
  const totalCupos = materias.reduce((sum, materia) => sum + materia.cupos, 0);

  // Estadísticas por semestre
  const materiasPorSemestre = materias.reduce((acc, materia) => {
    const semestre = materia.materia.nivel.semestre;
    if (!acc[semestre]) {
      acc[semestre] = 0;
    }
    acc[semestre]++;
    return acc;
  }, {} as Record<number, number>);

  // Materias electivas vs obligatorias
  const materiasElectivas = materias.filter(materia => materia.materia.esElectiva).length;
  const materiasObligatorias = materias.length - materiasElectivas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total de Materias */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            Total de Materias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-700">{materias.length}</div>
          <p className="text-xs text-gray-500 mt-1">
            {materiasElectivas} electivas • {materiasObligatorias} obligatorias
          </p>
        </CardContent>
      </Card>

      {/* Total de Créditos */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-600" />
            Total de Créditos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-700">{totalCreditos}</div>
          <p className="text-xs text-gray-500 mt-1">
            Créditos inscritos
          </p>
        </CardContent>
      </Card>

      {/* Ocupación de Cupos */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            Ocupación de Cupos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-700">
            {totalCupos > 0 ? Math.round((totalInscritos / totalCupos) * 100) : 0}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {totalInscritos} de {totalCupos} cupos
          </p>
        </CardContent>
      </Card>

      {/* Semestres */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            Distribución por Semestre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-700">
            {Object.keys(materiasPorSemestre).length}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Object.keys(materiasPorSemestre).length > 1 ? 'semestres activos' : 'semestre activo'}
          </p>
          <div className="space-y-1 mt-2">
            {Object.entries(materiasPorSemestre)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .slice(0, 3) // Mostrar solo los primeros 3
              .map(([semestre, cantidad]) => (
              <div key={semestre} className="flex justify-between text-xs">
                <span className="text-gray-600">{semestre}° sem:</span>
                <span className="font-medium text-slate-700">{cantidad}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}