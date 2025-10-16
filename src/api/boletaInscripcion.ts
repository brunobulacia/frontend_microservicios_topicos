import axios from "@/lib/axios";

export const getMateriasInscritas = async (matricula: string) => {
  const response = await axios.get(`/boleta-grupo-materias/${matricula}/`);
  return response.data;
};

export const getInscripcionStatus = async (taskId: string) => {
  const response = await axios.get(`/colas/jobs/${taskId}/status`);
  return response.data;
};
