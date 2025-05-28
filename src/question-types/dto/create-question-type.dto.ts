import { ApiProperty } from "@nestjs/swagger";

//   description String?
export class CreateQuestionTypeDto {
    @ApiProperty({ example: 'Multipla Escolha' })
    name: string;
    @ApiProperty({ example: 'Questões de múltipla escolha com uma ou mais respostas corretas.' })
    description?: string;
}
