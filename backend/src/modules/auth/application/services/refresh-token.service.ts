// backend\src\modules\auth\application\services\refresh-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RefreshToken } from '../../infrastructure/entities/refresh-token.entity';
import { User } from '@/modules/user/domain/entities/user.entity';

import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {}

  // 🔐 generar token random
  generateToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  // 🔐 hash del token (NO guardar token plano)
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // 💾 guardar token en DB
  async create(user: User): Promise<string> {
    const refreshToken = this.generateToken();
    const tokenHash = this.hashToken(refreshToken);

    const entity = this.repo.create({
      tokenHash,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    await this.repo.save(entity);

    return refreshToken; // 🔴 se devuelve SOLO una vez
  }

  // 🔍 validar token
  async validate(token: string): Promise<RefreshToken> {
    const hashed = this.hashToken(token);

    const storedToken = await this.repo.findOne({
      where: { tokenHash: hashed },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.revoked) {
      throw new UnauthorizedException('Token revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    return storedToken;
  }

  // 🔁 ROTACIÓN
  async rotate(oldToken: string): Promise<{ refreshToken: string; user: User }> {
    const storedToken = await this.validate(oldToken);

    // detectar reuse (ataque)
    if (storedToken.replacedByToken) {
      await this.revokeAllUserTokens(storedToken.user.id);
      throw new UnauthorizedException('Token reuse detected');
    }

    const newRefreshToken = this.generateToken();

    // invalidar token viejo
    storedToken.revoked = true;
    storedToken.replacedByToken = this.hashToken(newRefreshToken);

    await this.repo.save(storedToken);

    // guardar nuevo
    const newTokenEntity = this.repo.create({
      tokenHash: this.hashToken(newRefreshToken),
      user: storedToken.user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.repo.save(newTokenEntity);

    return {
      refreshToken: newRefreshToken,
      user: storedToken.user,
    };
  }

  // 🚪 logout (revocar uno)
  async revoke(token: string): Promise<void> {
    const hashed = this.hashToken(token);

    await this.repo.update(
      { tokenHash: hashed },
      { revoked: true },
    );
  }

  // 🔥 logout global / seguridad
  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.repo.update(
      { user: { id: userId }, revoked: false },
      { revoked: true },
    );
  }
}