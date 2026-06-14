// backend\src\modules\auth\auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { RefreshTokenService } from './application/services/refresh-token.service';
import { USER_REPOSITORY } from '@/modules/users/application/tokens';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RegisterUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            revokeAllUserTokens: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            incrementTokenVersion: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
