import { IsOptional, IsString, MaxLength } from 'class-validator';

export class OperationTransitionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
