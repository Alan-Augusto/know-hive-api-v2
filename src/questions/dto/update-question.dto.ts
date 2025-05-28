import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto, En_QuestionType } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
        @ApiProperty({ example: 'Qual a cor do cavalo branco de Napoleão?' })
        statement: string;
        @ApiProperty({enum: En_QuestionType, example: En_QuestionType.MULTIPLE_CHOICE})
        type: number;
}
