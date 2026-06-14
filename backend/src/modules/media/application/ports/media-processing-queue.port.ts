export type ProcessMediaJob = {
  mediaId: number;
};

export interface MediaProcessingQueuePort {
  enqueue(job: ProcessMediaJob): Promise<void>;
}
