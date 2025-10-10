export type OfertaGrupoMateria = {
  id: string;
  grupoMateriaId: string;
  maestroDeOfertaId: string;
  estaActivo: boolean;
  createdAt: string;
  updatedAt: string;
  GrupoMateria: {
    id: string;
    grupo: string;
    cupos: number;
    materia: {
      nombre: string;
    };
  };
};
