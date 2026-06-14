import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UploadListingMediaDto {
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isPrimary?: boolean;
}
