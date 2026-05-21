// backend\src\modules\publicaciones\application\use-cases\create-publicacion.usecase.ts
import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { CreatePublicacionCommand } from '@modules/publicaciones/application/commands/create-publicacion.command';

import { DocumentosService } from '@modules/publicaciones/application/services/documentos.service';
import { ValidacionesService } from '@modules/publicaciones/application/services/validaciones.service';
import { ModerationService } from '@modules/publicaciones/application/services/moderation.service';
import { PublicacionApplicationService } from '@modules/publicaciones/application/services/publicacion-application.service';
import { PropertyApplicationService } from '@modules/propiedades/application/services/property-application.service';
import { UploadsApplicationService } from '@modules/uploads/application/services/uploads-application.service';

@Injectable()
export class CreatePublicacionUseCase {
  constructor(
    private readonly dataSource: DataSource,

    private readonly propertyApplicationService: PropertyApplicationService,

    private readonly uploadsApplicationService: UploadsApplicationService,

    private readonly documentosService: DocumentosService,

    private readonly validacionesService: ValidacionesService,

    private readonly moderationService: ModerationService,

    private readonly publicacionApplicationService: PublicacionApplicationService,
  ) {}

  async execute(command: CreatePublicacionCommand) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const { dto, files, userId } = command;

      // ---------------------------------------------------
      // VALIDACIONES
      // ---------------------------------------------------

      await this.validacionesService.validate(dto);

      // ---------------------------------------------------
      // PROPERTY
      // ---------------------------------------------------

      const property = await this.propertyApplicationService.create({
        dto,

        userId,

        queryRunner,
      });

      // ---------------------------------------------------
      // UPLOADS
      // ---------------------------------------------------

      const uploads =
        await this.uploadsApplicationService.processPublicacionFiles({
          propertyId: property.id!,

          files,
        });

      // ---------------------------------------------------
      // DOCUMENTOS
      // ---------------------------------------------------

      await this.documentosService.attachDocuments({
        propertyId: property.id!,

        dto,

        uploads,
      });

      // ---------------------------------------------------
      // MODERATION
      // ---------------------------------------------------

      const moderation = await this.moderationService.generateInitialStatus({
        dto,

        uploads,
      });

      // ---------------------------------------------------
      // PUBLICACION
      // ---------------------------------------------------

      const publicacion = await this.publicacionApplicationService.create({
        propertyId: property.id!,

        moderation,
      });

      // ---------------------------------------------------
      // COMMIT
      // ---------------------------------------------------

      await queryRunner.commitTransaction();

      // ---------------------------------------------------
      // RESPONSE
      // ---------------------------------------------------
      return {
        success: true,

        message: 'Publicación creada correctamente',

        data: {
          propertyId: property.id,

          publicacionId: publicacion.id,

          status: publicacion.status,

          moderation,

          uploads,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
