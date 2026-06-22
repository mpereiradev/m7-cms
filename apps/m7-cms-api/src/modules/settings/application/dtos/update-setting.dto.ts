import { IsString, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingDto {
  @IsString()
  @MaxLength(255)
  key!: string;

  value!: unknown;
}

export class BatchUpdateSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSettingDto)
  items!: UpdateSettingDto[];
}
