// backend\src\modules\auth\application\dto\login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'test12345@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'S12345678asd!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
