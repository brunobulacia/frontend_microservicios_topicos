'use client';

import { JobStatus } from '@/hooks/useInscripcionAsync';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Loader, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface InscripcionProgressProps {
  jobStatus: JobStatus | null;
  isProcessing: boolean;
  selectedCount: number;
}

export default function InscripcionProgress({ 
  jobStatus, 
  isProcessing, 
  selectedCount 
}: InscripcionProgressProps) {
  if (!isProcessing || !jobStatus) {
    return null;
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'queued':
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6" />,
          title: 'En cola de procesamiento',
          description: `Tu inscripción de ${selectedCount} materia${selectedCount !== 1 ? 's' : ''} está en cola esperando ser procesada`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'waiting':
        return {
          icon: <Loader className="w-6 h-6 animate-spin" />,
          title: 'Procesando inscripción',
          description: 'Un worker está procesando tu solicitud de inscripción',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          title: '¡Inscripción completada!',
          description: 'Tu inscripción se ha procesado exitosamente',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-6 h-6" />,
          title: 'Error en la inscripción',
          description: 'Hubo un problema al procesar tu inscripción',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: <RotateCcw className="w-6 h-6" />,
          title: 'Procesando...',
          description: 'Procesando tu solicitud',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const statusInfo = getStatusInfo(jobStatus.status);

  return (
    <Card className={`border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} backdrop-blur-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center">
            <div className={`${statusInfo.color}`}>
              {statusInfo.icon}
            </div>
          </div>

          {/* Información del estado */}
          <div className="flex-1">
            <h3 className={`font-semibold ${statusInfo.color} mb-1`}>
              {statusInfo.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {statusInfo.description}
            </p>

            {/* Información adicional del job */}
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">Job ID:</span>
                <span className="font-mono bg-white/50 px-2 py-1 rounded">
                  {jobStatus.jobId.slice(0, 8)}...
                </span>
              </div>
              
              {jobStatus.queueName && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Cola:</span>
                  <span>{jobStatus.queueName}</span>
                </div>
              )}
              
              {jobStatus.timestamp && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Iniciado:</span>
                  <span>{new Date(jobStatus.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Barra de progreso para estados de procesamiento */}
            {(jobStatus.status === 'queued' || jobStatus.status === 'pending' || jobStatus.status === 'waiting') && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      jobStatus.status === 'queued' || jobStatus.status === 'pending' 
                        ? 'bg-blue-500 w-1/3' 
                        : 'bg-orange-500 w-2/3'
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>En cola</span>
                  <span>Procesando</span>
                  <span>Completado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}