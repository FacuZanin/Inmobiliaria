// backend\src\modules\auth\application\dto\login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
