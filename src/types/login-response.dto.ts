export interface MaestroDeOferta {
  id: string;
  [key: string]: any; // Para otros campos que pueda tener
}

export interface LoginResponseDto {
  access_token: string;
  id: string;
  nombre: string;
  email: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  ci: string;
  registro: string;
  ppac: number;
  maestroDeOferta?: MaestroDeOferta[];
  MaestroDeOferta?: MaestroDeOferta[];
}
