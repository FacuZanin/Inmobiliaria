// backend\src\modules\auth\infrastructure\controllers\auth.controller.ts
import { Inject } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { Public } from '../../../../shared/security/decorators/public.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Auth } from '../../../../shared/security/decorators/auth.decorator';

import { UserProfile } from '@shared/contracts';

import { LoginDto } from '../../application/dto/login.dto';
import { RegisterPublicDto } from '../../application/dto/register-public.dto';

import { RefreshTokenService } from '../../application/services/refresh-token.service';

import { User } from '../../../user/domain/entities/user.entity';

import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../application/use-cases/register.usecase';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.usecase';

import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';
import { USER_REPOSITORY } from '../../../user/application/tokens';

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

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.loginUC.execute(dto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
  register(@Body() dto: RegisterPublicDto) {
    return this.registerUC.execute({
      ...dto,
      profile: UserProfile.INQUILINO,
    });
  }

  @Post('refresh')
  @Public()
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
  @Auth()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];

    if (!token) {
      return { success: true };
    }

    await this.refreshTokenService.revoke(token);

    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return { success: true };
  }
}
