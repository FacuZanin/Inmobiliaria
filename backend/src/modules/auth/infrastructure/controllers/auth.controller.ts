// backend\src\modules\auth\infrastructure\controllers\auth.controller.ts
import {
  Inject,
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Public } from '@/core/shared/security/decorators/public.decorator';
import { CurrentUser } from '@/core/shared/security/decorators/current-user.decorator';
import { Auth } from '@/core/shared/security/decorators/auth.decorator';

import { LoginDto } from '@modules/auth/application/dto/login.dto';
import { RegisterDto } from '@modules/auth/application/dto/register.dto';

import { RefreshTokenService } from '@modules/auth/application/services/refresh-token.service';

import { LoginUseCase } from '@modules/auth/application/use-cases/login.usecase';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.usecase';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.usecase';

import type { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { USER_REPOSITORY } from '@/modules/users/application/tokens';

import { JwtPayload } from '@modules/auth/application/contracts/jwt-payload.contracts';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly registerUC: RegisterUseCase,
    private readonly refreshTokenUC: RefreshTokenUseCase,
    private readonly refreshTokenService: RefreshTokenService,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  @ApiOperation({
    summary: 'Iniciar sesión',
  })
  @ApiOkResponse({
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'JWT_TOKEN',
        user: {
          id: 1,
          email: 'admin@test.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
  })
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { access_token, refresh_token, user } = await this.loginUC.execute(
      dto,
      { ip, userAgent },
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token,
      user,
    };
  }
  @ApiOperation({
    summary: 'Registrar usuario',
  })
  @ApiCreatedResponse({
    description: 'Usuario registrado correctamente',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUC.execute(dto);
  }

  @ApiOperation({
    summary: 'Refrescar access token',
  })
  @ApiOkResponse({
    description: 'Token refrescado correctamente',
    schema: {
      example: {
        success: true,
        access_token: 'JWT_TOKEN',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido o expirado',
  })
  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldToken = req.cookies['refresh_token'];

    if (!oldToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { access_token, refresh_token } =
      await this.refreshTokenUC.execute(oldToken);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      access_token,
    };
  }

  @ApiOperation({
    summary: 'Cerrar sesión',
  })
  @ApiOkResponse({
    description: 'Logout exitoso',
  })
  @Post('logout')
  @Auth()
  @ApiBearerAuth('access-token')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 🔥 invalidar refresh tokens
    await this.refreshTokenService.revokeAllUserTokens(user.sub);

    // 🔥 invalidar TODOS los access tokens JWT
    await this.userRepository.incrementTokenVersion(user.sub);

    // 🍪 limpiar cookie refresh
    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return {
      success: true,
      message: 'Logout exitoso',
    };
  }

  @Get('perfil')
  @Auth()
  @ApiBearerAuth('access-token')
  getPerfil(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
