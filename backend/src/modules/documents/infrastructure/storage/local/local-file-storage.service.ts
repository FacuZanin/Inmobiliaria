// backend\src\modules\documents\infrastructure\storage\local\local-file-storage.service.ts
import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { promises as fs } from 'fs';

import { join } from 'path';

import { FileStoragePort } from '@/modules/documents/application/ports/file-storage.port';

@Injectable()
export class LocalFileStorageService implements FileStoragePort {
  async upload(
    file: Express.Multer.File,
    folder = 'documents',
  ): Promise<string> {
    const fileName = `${randomUUID()}-${file.originalname}`;

    const uploadPath = join(process.cwd(), 'uploads', folder);

    await fs.mkdir(uploadPath, {
      recursive: true,
    });

    const fullPath = join(uploadPath, fileName);

    await fs.writeFile(fullPath, file.buffer);

    return `/uploads/${folder}/${fileName}`;
  }

  async save(file: Express.Multer.File): Promise<string> {
    return this.upload(file);
  }

  async delete(fileUrl: string): Promise<void> {
    const relativePath = fileUrl.replace(/^\/+/, '');

    const fullPath = join(process.cwd(), relativePath);

    try {
      await fs.unlink(fullPath);
    } catch {
      // ignore
    }
  }
}
