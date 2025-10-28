export type JobStatus =
  | "completed"
  | "waiting"
  | "active"
  | "delayed"
  | "failed"
  | "paused";

export type JobResponse = {
  jobId: string;
  queueName: string;
  status: JobStatus;
  data: {
    registro: string;
    ofertaId: string[];
  };
  progress: number;
  createdAt: string;
  processedOn?: string;
  finishedOn?: string;
  returnValue?: {
    message: string;
    [key: string]: any;
  };
  attemptsMade: number;
  opts: {
    attempts: number;
    delay: number;
  };
  failedReason?: string;
};
