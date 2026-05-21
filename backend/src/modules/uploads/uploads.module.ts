// backend\src\modules\uploads\uploads.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UploadsController } from '@modules/uploads/infrastructure/controllers/uploads.controller';
import { LocalFileStorageService } from '@modules/uploads/infrastructure/storage/local-file-storage.service';
import { FILE_STORAGE } from '@modules/uploads/application/tokens';
import { UsersModule } from '@modules/user/users.module';
import { UploadsApplicationService } from '@modules/uploads/application/services/uploads-application.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [UploadsController],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorageService,
    },
    UploadsApplicationService,
  ],
  exports: [FILE_STORAGE,UploadsApplicationService,],
  
})
export class UploadsModule {}
