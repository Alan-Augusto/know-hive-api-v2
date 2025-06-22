import { IsArray, IsString, IsUUID } from 'class-validator';

export class AssignTagsDto {
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  tagIds: string[];
}
