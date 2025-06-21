import { ApiProperty } from "@nestjs/swagger";

export class CreateCollectionWithQuestionsDto {
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60', required: false })
    id?: string;
    @ApiProperty({ example: 'Matemática Básica' })
    title: string;
    @ApiProperty({ example: 'Uma coleção de questões sobre matemática básica para alunos de 6 a 12 anos.' })
    description: string;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    author_id: string;
    @ApiProperty({ example: true })
    is_public: boolean;
    @ApiProperty({ 
        type: [String],
        example: [
            'a49e39b3-81aa-4beb-bed4-e7103f962e60',
            'b57f41c4-92bb-5cfc-cfe5-f8204g073f71',
            'c68g52d5-a3cc-6dfd-dfg6-g9315h184g82'
        ]
    })
    questions_ids: string[];
}
