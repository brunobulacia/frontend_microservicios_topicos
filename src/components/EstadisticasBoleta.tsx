'use client';

import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <span>📚</span>
            Total de Materias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{materias.length}</div>
          <p className="text-xs text-blue-600 mt-1">
            {materiasElectivas} electivas • {materiasObligatorias} obligatorias
          </p>
        </CardContent>
      </Card>

      {/* Total de Créditos */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
            <span>🎯</span>
            Total de Créditos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{totalCreditos}</div>
          <p className="text-xs text-green-600 mt-1">
            Créditos inscritos
          </p>
        </CardContent>
      </Card>

      {/* Ocupación de Cupos */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
            <span>👥</span>
            Ocupación de Cupos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {totalCupos > 0 ? Math.round((totalInscritos / totalCupos) * 100) : 0}%
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {totalInscritos} de {totalCupos} cupos
          </p>
        </CardContent>
      </Card>

      {/* Semestres */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
            <span>📊</span>
            Distribución por Semestre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {Object.keys(materiasPorSemestre).length}
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {Object.keys(materiasPorSemestre).length > 1 ? 'semestres activos' : 'semestre activo'}
          </p>
          <div className="space-y-1 mt-2">
            {Object.entries(materiasPorSemestre)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .slice(0, 3) // Mostrar solo los primeros 3
              .map(([semestre, cantidad]) => (
              <div key={semestre} className="flex justify-between text-xs">
                <span className="text-orange-600">{semestre}° sem:</span>
                <span className="font-medium text-orange-700">{cantidad}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}