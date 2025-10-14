import axios from "@/lib/axios";
import { InscribirEstudiante } from "@/types/inscribir-estudiante";

export const getInscripcionAsync = async (data: InscribirEstudiante) => {
  const response = await axios.post(`/inscripcion/async/`, data);
  return response.data;
};

export const getInscripcionStatus = async (taskId: string) => {
  const response = await axios.get(`/colas/jobs/${taskId}/status`);
  return response.data;
};
