import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ListPostsFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  tagId?: string;
}
