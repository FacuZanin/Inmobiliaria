import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MediaFileValidatorService {
  private readonly allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

  private readonly maxSizeInBytes = Number(
    process.env.MEDIA_MAX_IMAGE_SIZE_BYTES ?? 8 * 1024 * 1024,
  );

  validateImage(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!this.allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported image mime type: ${file.mimetype}`);
    }

    if (!file.size || file.size < 1) {
      throw new BadRequestException('Image file is empty');
    }

    if (file.size > this.maxSizeInBytes) {
      throw new BadRequestException(
        `Image file exceeds max size of ${this.maxSizeInBytes} bytes`,
      );
    }
  }
}
