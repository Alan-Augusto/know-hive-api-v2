import { IsNotEmpty, IsString } from 'class-validator';

export class LikeCollectionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  collection_id: string;
}
