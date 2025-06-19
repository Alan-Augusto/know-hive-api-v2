import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto, En_QuestionType } from './create-question.dto';
import { CreateAlternativeDto } from 'src/alternatives/dto/create-alternative.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    @ApiProperty({ example: 'Qual a cor do cavalo branco de Napoleão?' })
    statement: string;
    @ApiProperty({ enum: En_QuestionType, example: En_QuestionType.MULTIPLE_CHOICE })
    type: number;

    @ApiProperty({
        type: [CreateAlternativeDto],
        required: false,
        example: [
            { text: 'Branco', is_correct: true },
            { text: 'Preto', is_correct: false }
        ]
    })
    alternatives?: CreateAlternativeDto[];
}
