import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InscripcionState {
  activeJobId: string | null;
  activeJobStatus:
    | "waiting"
    | "active"
    | "completed"
    | "failed"
    | "delayed"
    | "paused"
    | null;
  materiasEnProceso: string[] | null;
  setActiveInscripcion: (jobId: string, materias: string[]) => void;
  updateJobStatus: (status: InscripcionState["activeJobStatus"]) => void;
  clearActiveInscripcion: () => void;
  hasActiveInscripcion: () => boolean;
}

export const useInscripcionStore = create<InscripcionState>()(
  persist(
    (set, get) => ({
      activeJobId: null,
      activeJobStatus: null,
      materiasEnProceso: null,

      setActiveInscripcion: (jobId, materias) => {
        set({
          activeJobId: jobId,
          activeJobStatus: "waiting",
          materiasEnProceso: materias,
        });
      },

      updateJobStatus: (status) => {
        set({ activeJobStatus: status });
      },

      clearActiveInscripcion: () => {
        set({
          activeJobId: null,
          activeJobStatus: null,
          materiasEnProceso: null,
        });
      },

      hasActiveInscripcion: () => {
        const state = get();
        return !!(
          state.activeJobId &&
          state.activeJobStatus &&
          ["waiting", "active", "delayed", "paused"].includes(
            state.activeJobStatus
          )
        );
      },
    }),
    {
      name: "inscripcion-status",
    }
  )
);
