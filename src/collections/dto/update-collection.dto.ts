import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
    @ApiProperty({ example: 'Matemática Básica' })
    title: string;
    @ApiProperty({ example: 'Uma coleção de questões sobre matemática básica para alunos de 6 a 12 anos.' })
    description: string;
}
