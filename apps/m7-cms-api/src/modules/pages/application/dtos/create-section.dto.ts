import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @MaxLength(100)
  type!: string;

  @IsInt()
  order!: number;

  @IsOptional()
  content?: unknown;
}

export class ReorderSectionsDto {
  sections!: { id: string; order: number }[];
}
