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
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

import { Public } from '../../../../shared/security/decorators/public.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { AllowIncompleteProfile } from '@/shared/security/decorators/allow-incomplete-profile.decorator';

import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';

import { RefreshTokenService } from '../../application/services/refresh-token.service';

import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../application/use-cases/register.usecase';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.usecase';

import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import { USER_REPOSITORY } from '../../../user/application/tokens';

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

  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'JWT_TOKEN_ACA',
        user: {
          id: 1,
          email: 'test12345@gmail.com',
        },
      },
    },
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

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUC.execute(dto);
  }

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
      access_token,
    };
  }

  @Post('logout')
  @AllowIncompleteProfile()
  @Auth()
  @ApiBearerAuth('access-token')
  async logout(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.refreshTokenService.revokeAllUserTokens(user.id);

    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return { success: true };
  }

  @Get('perfil')
  @ApiBearerAuth('access-token')
  getPerfil(@CurrentUser() user: any) {
    return user;
  }
}
