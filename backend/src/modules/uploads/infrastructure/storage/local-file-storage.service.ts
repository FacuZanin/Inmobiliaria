// backend\src\modules\uploads\infrastructure\storage\local-file-storage.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

import type { FileStoragePort } from '../../application/ports/file-storage.port';

@Injectable()
export class LocalFileStorageService implements FileStoragePort {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async save(file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const filepath = join(this.uploadsDir, filename);

    writeFileSync(filepath, file.buffer);

    return `/uploads/${filename}`;
  }

  async delete(filename: string): Promise<void> {
    const filepath = join(this.uploadsDir, filename);
    if (existsSync(filepath)) {
      require('fs').unlinkSync(filepath);
    }
  }
}
