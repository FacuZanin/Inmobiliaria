import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class RescheduleVisitDto {
  @IsISO8601()
  desiredAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
