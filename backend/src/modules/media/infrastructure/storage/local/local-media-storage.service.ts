import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import {
  MediaStorageFile,
  MediaStoragePort,
  MediaStorageResult,
} from '@/modules/media/application/ports/media-storage.port';

@Injectable()
export class LocalMediaStorageService implements MediaStoragePort {
  async save(
    file: MediaStorageFile,
    folder: string,
  ): Promise<MediaStorageResult> {
    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+/, '');
    const extension = extname(file.originalName);
    const fileName = `${randomUUID()}${extension}`;
    const relativePath = join('uploads', 'media', safeFolder, fileName);
    const fullPath = join(process.cwd(), relativePath);

    await fs.mkdir(join(process.cwd(), 'uploads', 'media', safeFolder), {
      recursive: true,
    });

    await fs.writeFile(fullPath, file.buffer);

    const urlPath = relativePath.replace(/\\/g, '/');

    return {
      storageKey: urlPath,
      url: `/${urlPath}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const safeKey = storageKey.replace(/^\/+/, '');
    const fullPath = join(process.cwd(), safeKey);

    try {
      await fs.unlink(fullPath);
    } catch {
      // File may already be gone; deletion remains idempotent.
    }
  }
}
