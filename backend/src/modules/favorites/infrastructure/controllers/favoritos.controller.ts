// backend/src/modules/favoritos/infrastructure/controllers/favoritos.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';

import { AddFavoriteUseCase } from '../../application/use-cases/add-favorite.usecase';
import { RemoveFavoriteUseCase } from '../../application/use-cases/remove-favorite.usecase';
import { GetMyFavoritesUseCase } from '../../application/use-cases/get-my-favorites.usecase';
import { IsFavoriteUseCase } from '../../application/use-cases/is-favorite.usecase';

@ApiTags('Favoritos')
@ApiBearerAuth('access-token')
@Auth()
@Controller('favoritos')
export class FavoritosController {
  constructor(
    private readonly addFavoriteUseCase: AddFavoriteUseCase,

    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,

    private readonly getMyFavoritesUseCase: GetMyFavoritesUseCase,

    private readonly isFavoriteUseCase: IsFavoriteUseCase,
  ) {}

  @Post(':propertyId')
  @ApiOperation({
    summary: 'Agregar propiedad a favoritos',
  })
  @ApiCreatedResponse({
    description: 'Favorito agregado correctamente',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Propiedad no encontrada',
  })
  async addFavorite(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.addFavoriteUseCase.execute(
      userId,
      propertyId,
    );
  }

  @Delete(':propertyId')
  @ApiOperation({
    summary: 'Eliminar propiedad de favoritos',
  })
  @ApiOkResponse({
    description: 'Favorito eliminado correctamente',
  })
  async removeFavorite(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.removeFavoriteUseCase.execute(
      userId,
      propertyId,
    );
  }

  @Get('mis-favoritos')
  @ApiOperation({
    summary: 'Obtener mis favoritos',
  })
  @ApiOkResponse({
    description: 'Listado de favoritos',
  })
  async getMyFavorites(
    @CurrentUser('id') userId: number,
  ) {
    return this.getMyFavoritesUseCase.execute(
      userId,
    );
  }

  @Get('is-favorite/:propertyId')
  @ApiOperation({
    summary: 'Verificar si es favorito',
  })
  @ApiOkResponse({
    description: 'Estado favorito',
  })
  async isFavorite(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    const isFavorite =
      await this.isFavoriteUseCase.execute(
        userId,
        propertyId,
      );

    return {
      isFavorite,
    };
  }
}
