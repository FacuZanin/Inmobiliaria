// backend/src/modules/favoritos/infrastructure/controllers/favoritos.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
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

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';

import { AddFavoriteUseCase } from '../../application/use-cases/add-favorite.usecase';
import { RemoveFavoriteUseCase } from '../../application/use-cases/remove-favorite.usecase';
import { GetMyFavoritesUseCase } from '../../application/use-cases/get-my-favorites.usecase';
import { IsFavoriteUseCase } from '../../application/use-cases/is-favorite.usecase';

@ApiTags('Favoritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    @Req() req: any,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.addFavoriteUseCase.execute(req.user.id, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({
    summary: 'Eliminar propiedad de favoritos',
  })
  @ApiOkResponse({
    description: 'Favorito eliminado correctamente',
  })
  async removeFavorite(
    @Req() req: any,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.removeFavoriteUseCase.execute(req.user.id, propertyId);
  }

  @Get('mis-favoritos')
  @ApiOperation({
    summary: 'Obtener mis favoritos',
  })
  @ApiOkResponse({
    description: 'Listado de favoritos',
  })
  async getMyFavorites(@Req() req: any) {
    return this.getMyFavoritesUseCase.execute(req.user.id);
  }

  @Get('is-favorite/:propertyId')
  @ApiOperation({
    summary: 'Verificar si es favorito',
  })
  @ApiOkResponse({
    description: 'Estado favorito',
  })
  async isFavorite(
    @Req() req: any,
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    const isFavorite = await this.isFavoriteUseCase.execute(
      req.user.id,
      propertyId,
    );

    return {
      isFavorite,
    };
  }
}
