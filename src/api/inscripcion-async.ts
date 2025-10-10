import axios from "@/lib/axios";
import { InscribirEstudiante } from "@/types/inscribir-estudiante";

export const getInscripcionAsync = async (data: InscribirEstudiante) => {
  const response = await axios.post(`/inscripcion/async/`, { data });
  return response.data;
};
