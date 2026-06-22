import {
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreHourEntryDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'openTime must be in HH:mm or HH:mm:ss format',
  })
  openTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'closeTime must be in HH:mm or HH:mm:ss format',
  })
  closeTime!: string;
}

export class SetStoreHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreHourEntryDto)
  hours!: StoreHourEntryDto[];
}
