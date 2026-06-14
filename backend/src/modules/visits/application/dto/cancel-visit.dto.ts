import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelVisitDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
