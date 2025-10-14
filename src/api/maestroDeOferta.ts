import axios from "@/lib/axios";

export const getMaestroDeOferta = async (id: string) => {
  const response = await axios.get(`/maestro-de-ofertas/${id}`);
  return response.data;
};

export const getAllMaestrosDeOferta = async () => {
  const response = await axios.get("/maestro-de-ofertas");
  return response.data;
};
