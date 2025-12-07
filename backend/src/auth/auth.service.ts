import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const exists = await this.usersService.findByEmail(data.email);
    if (exists) throw new ConflictException('El email ya está registrado');

    const user = await this.usersService.create(data);

    return {
      message: 'Usuario creado correctamente',
      user,
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      user,
    };
  }
}
