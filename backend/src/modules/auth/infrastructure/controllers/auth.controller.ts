// backend\src\modules\auth\infrastructure\controllers\auth.controller.ts
import { Inject } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Auth } from '../../../../common/decorators/auth.decorator';

import { UserProfile } from '@shared/contracts';

import { LoginDto } from '../../application/dto/login.dto';
import { RegisterPublicDto } from '../../application/dto/register-public.dto';


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

  @Inject(USER_REPOSITORY)
  private readonly userRepository: UserRepositoryPort,
) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUC.execute(dto);
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
  refresh(@Body('refreshToken') token: string) {
    return this.refreshTokenUC.execute(token);
  }

  @Auth()
  @Post('logout')
  async logout(@CurrentUser() user: User) {
    return { success: true };
  }
}
