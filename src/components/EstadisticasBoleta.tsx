'use client';

import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EstadisticasProps {
  materias: BoletaInscripcion[];
}

export default function EstadisticasBoleta({ materias }: EstadisticasProps) {
  // Cálculos
  const totalCreditos = materias.reduce((sum, materia) => sum + materia.grupoMateria.materia.creditos, 0);
  const materiasConNota = materias.filter(materia => materia.nota !== undefined);
  const promedioGeneral = materiasConNota.length > 0 
    ? materiasConNota.reduce((sum, materia) => sum + (materia.nota || 0), 0) / materiasConNota.length 
    : 0;

  // Estadísticas por estado
  const aprobadas = materias.filter(materia => materia.nota !== undefined && materia.nota >= 70).length;
  const regulares = materias.filter(materia => materia.nota !== undefined && materia.nota >= 60 && materia.nota < 70).length;
  const reprobadas = materias.filter(materia => materia.nota !== undefined && materia.nota < 60).length;
  const enCurso = materias.filter(materia => materia.nota === undefined).length;

  // Créditos por estado
  const creditosAprobados = materias
    .filter(materia => materia.nota !== undefined && materia.nota >= 70)
    .reduce((sum, materia) => sum + materia.grupoMateria.materia.creditos, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total de Materias */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Materias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{materias.length}</div>
          <p className="text-xs text-gray-500 mt-1">Materias registradas</p>
        </CardContent>
      </Card>

      {/* Total de Créditos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalCreditos}</div>
          <p className="text-xs text-gray-500 mt-1">
            {creditosAprobados} aprobados
          </p>
        </CardContent>
      </Card>

      {/* Promedio General */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Promedio General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            promedioGeneral >= 70 ? 'text-green-600' : 
            promedioGeneral >= 60 ? 'text-yellow-600' : 
            promedioGeneral > 0 ? 'text-red-600' : 'text-gray-400'
          }`}>
            {promedioGeneral > 0 ? promedioGeneral.toFixed(2) : 'N/A'}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {materiasConNota.length} materias evaluadas
          </p>
        </CardContent>
      </Card>

      {/* Estado General */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Estado General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Aprobadas:</span>
              <span className="font-medium">{aprobadas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Regulares:</span>
              <span className="font-medium">{regulares}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Reprobadas:</span>
              <span className="font-medium">{reprobadas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">En curso:</span>
              <span className="font-medium">{enCurso}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}