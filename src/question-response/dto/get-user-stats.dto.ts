import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserStatsDto {
  @ApiPropertyOptional({ 
    description: 'ID da coleção para filtrar estatísticas',
    example: 'd79h69e6-14dc-7ege-eh37-h0426i295h93' 
  })
  @IsOptional()
  @IsString()
  collection_id?: string;
}
