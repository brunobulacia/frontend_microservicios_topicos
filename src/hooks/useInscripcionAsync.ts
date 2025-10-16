"use client";

import { useState, useCallback, useRef } from "react";
import { getInscripcionAsync } from "@/api/inscripcion-async";
import { getInscripcionStatus } from "@/api/boletaInscripcion";
import { InscribirEstudiante } from "@/types/inscribir-estudiante";
import { useAuthStore } from "@/store/auth.store";
// Función simple para generar UUID sin dependencias externas
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface JobStatus {
  jobId: string;
  status: "pending" | "waiting" | "completed" | "failed" | "queued";
  progress?: number;
  result?: any;
  error?: string;
  queueName?: string;
  timestamp?: string;
}

export interface InscripcionAsyncState {
  isProcessing: boolean;
  currentJobId: string | null;
  jobStatus: JobStatus | null;
  requestId: string | null;
  error: string | null;
  success: boolean;
}

export function useInscripcionAsync() {
  const { user } = useAuthStore();
  const [state, setState] = useState<InscripcionAsyncState>({
    isProcessing: false,
    currentJobId: null,
    jobStatus: null,
    requestId: null,
    error: null,
    success: false,
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentRequestIdRef = useRef<string | null>(null);

  // Generar requestId único para idempotencia
  const generateRequestId = useCallback(
    (materiasIds: string[]): string => {
      const baseData = `${user?.matricula}-${materiasIds
        .sort()
        .join(",")}-${Date.now()}`;
      return generateUUID(); // Usamos UUID para mayor unicidad
    },
    [user?.matricula]
  );

  // Función para hacer polling del estado del job
  const startPolling = useCallback(async (jobId: string) => {
    const pollStatus = async () => {
      try {
        const statusResponse = await getInscripcionStatus(jobId);

        setState((prev) => ({
          ...prev,
          jobStatus: statusResponse,
          error: null,
        }));

        // Si el job está completado o falló, detener el polling
        if (statusResponse.status === "completed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setState((prev) => ({
            ...prev,
            isProcessing: false,
            success: true,
          }));

          // Limpiar estado después de 3 segundos
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              success: false,
              currentJobId: null,
              jobStatus: null,
              requestId: null,
            }));
            currentRequestIdRef.current = null;
          }, 3000);
        } else if (statusResponse.status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setState((prev) => ({
            ...prev,
            isProcessing: false,
            error:
              statusResponse.error || "Error desconocido en el procesamiento",
          }));
        }
      } catch (error) {
        console.error("Error al consultar estado del job:", error);
        setState((prev) => ({
          ...prev,
          error: "Error al consultar el estado de la inscripción",
        }));
      }
    };

    // Hacer primera consulta inmediatamente
    await pollStatus();

    // Configurar polling cada 2 segundos
    pollingIntervalRef.current = setInterval(pollStatus, 2000);
  }, []);

  // Función principal para iniciar inscripción
  const iniciarInscripcion = useCallback(
    async (materiasIds: string[]) => {
      if (!user?.matricula) {
        setState((prev) => ({ ...prev, error: "Usuario no autenticado" }));
        return;
      }

      if (materiasIds.length === 0) {
        setState((prev) => ({
          ...prev,
          error: "Debe seleccionar al menos una materia",
        }));
        return;
      }

      // Generar requestId para idempotencia
      const requestId = generateRequestId(materiasIds);

      // Verificar si ya hay una operación en curso con el mismo requestId
      if (currentRequestIdRef.current === requestId) {
        console.log("Operación ya en curso, ignorando solicitud duplicada");
        return;
      }

      currentRequestIdRef.current = requestId;

      setState((prev) => ({
        ...prev,
        isProcessing: true,
        requestId,
        error: null,
        success: false,
        currentJobId: null,
        jobStatus: null,
      }));

      try {
        const inscripcionData: InscribirEstudiante = {
          registro: user.matricula,
          materiasId: materiasIds,
        };

        // Enviar solicitud de inscripción
        const response = await getInscripcionAsync(inscripcionData);

        console.log("Respuesta de inscripción:", response);

        setState((prev) => ({
          ...prev,
          currentJobId: response.jobId,
          jobStatus: {
            jobId: response.jobId,
            status: response.status || "queued",
            queueName: response.queueName,
            timestamp: response.timestamp,
          },
        }));

        // Iniciar polling para monitorear el estado
        await startPolling(response.jobId);
      } catch (error) {
        console.error("Error al iniciar inscripción:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error:
            error instanceof Error
              ? error.message
              : "Error al procesar la inscripción",
        }));
        currentRequestIdRef.current = null;
      }
    },
    [user?.matricula, generateRequestId, startPolling]
  );

  // Función para cancelar la operación actual
  const cancelarInscripcion = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setState({
      isProcessing: false,
      currentJobId: null,
      jobStatus: null,
      requestId: null,
      error: null,
      success: false,
    });

    currentRequestIdRef.current = null;
  }, []);

  // Limpiar intervalos al desmontar
  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return {
    ...state,
    iniciarInscripcion,
    cancelarInscripcion,
    cleanup,
  };
}
