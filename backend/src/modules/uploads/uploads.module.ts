// backend\src\modules\uploads\uploads.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UploadsController } from './infrastructure/controllers/uploads.controller';
import { LocalFileStorageService } from './infrastructure/storage/local-file-storage.service';
import { FILE_STORAGE } from './application/tokens';
import { UsersModule } from '../user/users.module';

@Module({
    imports: [
    forwardRef(() => UsersModule),
  ],
  controllers: [UploadsController],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [FILE_STORAGE],
})
export class UploadsModule {}
