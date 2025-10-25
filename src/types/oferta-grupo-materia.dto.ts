export type OfertaGrupoMateria = {
  id: string;
  grupoMateriaId: string;
  detalleGrupoMateria: {
    id: string;
    grupo: string;
    inscritos: number;
    cupos: number;
    materiaId: string;
    docenteId: string;
    periodoId: string;
    isActive: boolean;
    updatedAt: string;
    createdAt: string;
    AulaGrupoMateria: Array<{
      id: string;
      grupoMateriaId: string;
      aulaId: string;
      isActive: boolean;
      updatedAt: string;
      createdAt: string;
      aula: {
        numero: number;
      };
      horario: Array<{
        diaSemana: string;
        horaInicio: string;
        horaFin: string;
      }>;
    }>;
    Docente: {
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
    };
    materia: {
      id: string;
      sigla: string;
      nombre: string;
      creditos: number;
      esElectiva: boolean;
      isActive: boolean;
      nivelId: string;
      planDeEstudioId: string;
      updatedAt: string;
      createdAt: string;
      nivel: {
        semestre: number;
      };
    };
  };
};
