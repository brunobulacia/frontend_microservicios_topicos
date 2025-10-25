'use client';

import { useInscripcionStore } from '@/store/inscripcion.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Clock, Loader, Eye } from 'lucide-react';

export default function InscripcionActivaBanner() {
  const { 
    activeJobId, 
    activeJobStatus, 
    materiasEnProceso, 
    hasActiveInscripcion 
  } = useInscripcionStore();
  
  const router = useRouter();

  if (!hasActiveInscripcion()) {
    return null;
  }

  const getStatusInfo = () => {
    switch (activeJobStatus) {
      case 'waiting':
      case 'active':
        return {
          icon: <Loader className="w-5 h-5 animate-spin" />,
          title: 'Inscripción en proceso',
          description: 'Tu inscripción se está procesando',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'delayed':
      case 'paused':
        return {
          icon: <Clock className="w-5 h-5" />,
          title: 'Inscripción en cola',
          description: 'Tu inscripción está en cola de procesamiento',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          title: 'Inscripción completada',
          description: 'Tu inscripción se completó exitosamente',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'failed':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'Error en inscripción',
          description: 'Hubo un problema con tu inscripción',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'Estado desconocido',
          description: 'Estado de inscripción no determinado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleVerEstado = () => {
    router.push(`/estado-inscripcion?taskId=${activeJobId}`);
  };

  return (
    <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 mb-6`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-3">
          {statusInfo.description}
        </p>
        
        {materiasEnProceso && materiasEnProceso.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Materias en proceso ({materiasEnProceso.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {materiasEnProceso.slice(0, 3).map((materia, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {materia}
                </Badge>
              ))}
              {materiasEnProceso.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{materiasEnProceso.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleVerEstado}
            size="sm"
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver estado completo
          </Button>
          
          <div className="text-xs text-gray-500">
            ID: {activeJobId?.slice(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
}