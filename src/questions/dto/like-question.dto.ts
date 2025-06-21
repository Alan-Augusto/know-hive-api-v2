import { IsNotEmpty, IsString } from 'class-validator';

export class LikeQuestionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  question_id: string;
}
