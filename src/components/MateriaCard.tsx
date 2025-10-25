'use client';

import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MateriaCardProps {
  materia: BoletaInscripcion;
}

export default function MateriaCard({ materia }: MateriaCardProps) {
  const nombreDocente = `${materia.Docente.nombre} ${materia.Docente.apellido_paterno} ${materia.Docente.apellido_materno}`;
  const aula = materia.AulaGrupoMateria[0]; // Tomamos la primera aula

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 mb-2 flex items-center gap-2">
              <span>📚</span>
              {materia.materia.nombre}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {materia.materia.sigla}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Grupo {materia.grupo}
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {materia.materia.creditos} créditos
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                Semestre {materia.materia.nivel.semestre}
              </Badge>
              {materia.materia.esElectiva && (
                <Badge className="bg-orange-100 text-orange-700 text-xs">
                  Electiva
                </Badge>
              )}
            </CardDescription>
          </div>
          
          {/* Estado de la inscripción */}
          <div className="flex-shrink-0 ml-4">
            <Badge className="bg-green-100 text-green-700">
              Inscrito
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Información del docente */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">👨‍🏫 Docente:</span>
            <span className="text-gray-800 font-medium text-right">
              {nombreDocente}
            </span>
          </div>

          {/* Información de cupos */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">📊 Cupos:</span>
            <span className="text-gray-800 font-semibold">
              {materia.inscritos} / {materia.cupos}
            </span>
          </div>

          {/* Información del aula y horario */}
          {aula && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">🏫 Aula:</span>
                <span className="text-gray-800 font-semibold">
                  Aula {aula.aula.numero}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600 font-medium">🕐 Horario:</span>
                <div className="mt-2 space-y-1">
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

          {/* Estado de la materia */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Estado:</span>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                ✅ Matriculado
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}