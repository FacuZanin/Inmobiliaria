// backend\src\modules\uploads\application\services\uploads-application.service.ts
import { Injectable, Inject }
  from '@nestjs/common';

import type { FileStoragePort }
  from '@modules/uploads/application/ports/file-storage.port';

import { FILE_STORAGE }
  from '../tokens';

@Injectable()
export class UploadsApplicationService {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage:
      FileStoragePort,
  ) {}

  async processPublicacionFiles({
    propertyId,
    files,
  }: {
    propertyId: number;

    files: Express.Multer.File[];
  }) {
    if (!files?.length) {
      return [];
    }

    const uploads =
      await Promise.all(
        files.map(async (file, index) => {
          const path =
            await this.storage.save(
              file,
            );

          return {
            propertyId,

            path,

            order: index,

            featured:
              index === 0,
          };
        }),
      );

    return uploads;
  }
}