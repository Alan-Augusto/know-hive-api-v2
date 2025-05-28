import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(OmitType(CreateCollectionDto, ['author_id'] as const)){
    @ApiProperty({ example: 'Matemática Básica' })
    title: string;
    @ApiProperty({ example: 'Uma coleção de questões sobre matemática básica para alunos de 6 a 12 anos.' })
    description: string;
}
