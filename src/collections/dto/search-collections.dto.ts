import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SearchCollectionsDto {
  @ApiProperty({
    description: 'Termo de pesquisa para buscar em título, descrição e tags',
    example: 'javascript'
  })
  @IsNotEmpty()
  @IsString()
  searchTerm: string;

  @ApiProperty({
    description: 'ID do usuário que está fazendo a pesquisa',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
