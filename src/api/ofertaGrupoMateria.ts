import axios from "@/lib/axios";

export const getOfertaGrupoMateria = async (id: string) => {
  const response = await axios.get(`/oferta-grupo-materias/${id}`);
  return response.data;
};
