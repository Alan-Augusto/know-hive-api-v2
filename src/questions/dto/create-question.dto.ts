import { ApiProperty } from "@nestjs/swagger";
// TODO: Transferir esse enum para a entidade de QuestionType
export enum En_QuestionType {
    MULTIPLE_CHOICE = 1,
    TRUE_FALSE = 2,
    FILL_IN_THE_BLANK = 3,
    OPEN_ENDED = 4,
}

export class CreateQuestionDto {
    @ApiProperty({ example: 'Qual a cor do cavalo branco de Napoleão?' })
    statement: string;
    @ApiProperty({enum: En_QuestionType, example: En_QuestionType.MULTIPLE_CHOICE})
    type: number;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    author_id: string;
    @ApiProperty({ example: true })
    is_public: boolean;
}