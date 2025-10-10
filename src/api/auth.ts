import axios from "@/lib/axios";
import LoginDto from "@/types/login.dto";

export const login = async (data: LoginDto) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};
