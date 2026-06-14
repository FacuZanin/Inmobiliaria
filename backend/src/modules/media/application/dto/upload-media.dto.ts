import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaOwnerType } from '../../domain/enums/media-owner-type.enum';

export class UploadMediaDto {
  @IsEnum(MediaOwnerType)
  ownerType!: MediaOwnerType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ownerId!: number;

  @IsOptional()
  @IsString()
  collection?: string;
}
