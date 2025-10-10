import axios from "@/lib/axios";

export const getMaestroDeOferta = async (id: string) => {
  const response = await axios.get(`/maestro-de-ofertas/${id}`);
  return response.data;
};
