import axios from "@/lib/axios";

export const getDetalleAvance = async (estudianteId: string) => {
  const response = await axios.get(
    `/avance-academico/vencidas/${estudianteId}`
  );
  return response.data;
};
