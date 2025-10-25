import axios from "@/lib/axios";

export const getOfertaGrupoMateria = async (id: string) => {
  const response = await axios.get(`/ofertas-grupo-materia/maestro/${id}/`);
  return response.data;
};
