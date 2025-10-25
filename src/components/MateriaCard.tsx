'use client';

import { BoletaInscripcion } from "@/types/boleta-inscripcion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Users, MapPin, Clock, CheckCircle } from 'lucide-react';

interface MateriaCardProps {
  materia: BoletaInscripcion;
}

export default function MateriaCard({ materia }: MateriaCardProps) {
  const nombreDocente = `${materia.Docente.nombre} ${materia.Docente.apellido_paterno} ${materia.Docente.apellido_materno}`;
  const aula = materia.AulaGrupoMateria[0]; // Tomamos la primera aula

  return (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              {materia.materia.nombre}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {materia.materia.sigla}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Grupo {materia.grupo}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {materia.materia.creditos} créditos
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Semestre {materia.materia.nivel.semestre}
              </Badge>
              {materia.materia.esElectiva && (
                <Badge variant="secondary" className="text-xs">
                  Electiva
                </Badge>
              )}
            </CardDescription>
          </div>
          
          {/* Estado de la inscripción */}
          <div className="flex-shrink-0 ml-4">
            <Badge className="bg-green-50 text-green-700 border border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Inscrito
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Información del docente */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium flex items-center gap-1">
              <User className="w-4 h-4" />
              Docente:
            </span>
            <span className="text-slate-800 font-medium text-right">
              {nombreDocente}
            </span>
          </div>

          {/* Información de cupos */}
          {/* <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              Cupos:
            </span>
            <span className="text-slate-800 font-semibold">
              {materia.inscritos} / {materia.cupos}
            </span>
          </div> */}

          {/* Información del aula y horario */}
          {aula && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Aula:
                </span>
                <span className="text-slate-800 font-semibold">
                  Aula {aula.aula.numero}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600 font-medium flex items-center gap-1 mb-2">
                  <Clock className="w-4 h-4" />
                  Horario:
                </span>
                <div className="space-y-1">
                  {aula.horario.map((horario, index) => (
                    <div key={index} className="text-xs text-slate-700 bg-gray-50 p-2 rounded flex justify-between border border-gray-200">
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
                <CheckCircle className="w-3 h-3 mr-1" />
                Matriculado
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}