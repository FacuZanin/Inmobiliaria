import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

@Injectable()
export class UploadsService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    // Crear directorio si no existe
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const filepath = join(this.uploadsDir, filename);

    writeFileSync(filepath, file.buffer);

    return `/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = join(this.uploadsDir, filename);
    if (existsSync(filepath)) {
      require('fs').unlinkSync(filepath);
    }
  }
}
