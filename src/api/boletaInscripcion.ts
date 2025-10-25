import axios from "@/lib/axios";

export const getMateriasInscritas = async (estudianteId: string) => {
  const response = await axios.get(
    `/boletas-inscripcion/estudiante/${estudianteId}/`
  );
  return response.data;
};
