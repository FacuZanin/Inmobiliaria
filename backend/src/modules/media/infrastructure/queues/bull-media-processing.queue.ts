import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  MediaProcessingQueuePort,
  ProcessMediaJob,
} from '@/modules/media/application/ports/media-processing-queue.port';
import { MEDIA_PROCESSING_QUEUE_NAME } from './media-queue.constants';

@Injectable()
export class BullMediaProcessingQueue implements MediaProcessingQueuePort {
  constructor(
    @InjectQueue(MEDIA_PROCESSING_QUEUE_NAME)
    private readonly queue: Queue<ProcessMediaJob>,
  ) {}

  async enqueue(job: ProcessMediaJob): Promise<void> {
    await this.queue.add('process-media', job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: 100,
    });
  }
}
