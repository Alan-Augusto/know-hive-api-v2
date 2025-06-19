import { ApiProperty } from "@nestjs/swagger";
import { CreateAlternativeDto } from "src/alternatives/dto/create-alternative.dto";
import { En_QuestionType } from "./create-question.dto";

export class CreateQuestionWithAlternativesDto {
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60', required: false })
    id?: string;
    @ApiProperty({ example: 'Qual a cor do cavalo branco de Napoleão?' })
    statement: string;
    @ApiProperty({enum: En_QuestionType, example: En_QuestionType.MULTIPLE_CHOICE})
    type: number;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    author_id: string;
    @ApiProperty({ example: true })
    is_public: boolean;
    @ApiProperty({ 
        type: [CreateAlternativeDto],
        example: [
            { text: 'Branco', is_correct: true },
            { text: 'Preto', is_correct: false },
            { text: 'Azul', is_correct: false }
        ]
    })
    alternatives: CreateAlternativeDto[];
}
