import { IsISO8601, IsOptional } from 'class-validator';

export class AcceptVisitDto {
  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;
}
