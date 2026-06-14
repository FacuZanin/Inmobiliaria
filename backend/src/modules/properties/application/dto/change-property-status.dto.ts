import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

export class ChangePropertyStatusDto {
  @ApiProperty({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  status!: PropertyStatus;
}
