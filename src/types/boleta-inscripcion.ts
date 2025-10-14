export type BoletaInscripcion = {
  id: string;
  nota?: number;
  grupoMateria: {
    grupo: string;
    materia: {
      nombre: string;
      creditos: number;
      sigla: string;
      nivel: {
        semestre: number;
      };
    };
  };
};
