import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetResponsesQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID do usuário',
    example: 'b59f49c4-92ba-5cfc-cf15-f8204g073f71' 
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por ID da questão',
    example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' 
  })
  @IsOptional()
  @IsString()
  question_id?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por ID da coleção',
    example: 'd79h69e6-14dc-7ege-eh37-h0426i295h93' 
  })
  @IsOptional()
  @IsString()
  collection_id?: string;
}
