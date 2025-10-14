import axios from "@/lib/axios";
export const getMateriasInscritas = async (matricula: string) => {
  const response = await axios.get(`/boleta-grupo-materias/${matricula}/`);
  return response.data;
};
