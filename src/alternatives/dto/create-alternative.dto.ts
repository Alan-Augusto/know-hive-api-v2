import { ApiProperty } from "@nestjs/swagger";

export class CreateAlternativeDto {
    @ApiProperty({ example: 'Branco' })
    text: string;
    @ApiProperty({ example: true })
    is_correct: boolean;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    question_id: string;
}
