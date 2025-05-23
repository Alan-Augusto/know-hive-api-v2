import { ApiProperty } from "@nestjs/swagger";

export class CreateCollectionDto {
    @ApiProperty({ example: 'Matemática Básica' })
    title: string;
    @ApiProperty({ example: 'Uma coleção de questões sobre matemática básica para alunos de 6 a 12 anos.' })
    description: string;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    author_id: string;
}
