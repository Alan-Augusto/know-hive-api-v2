import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateQuestionResponseDto {
  @ApiProperty({ 
    description: 'ID da questão respondida',
    example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' 
  })
  @IsNotEmpty()
  @IsString()
  question_id: string;

  @ApiProperty({ 
    description: 'ID do usuário que respondeu',
    example: 'b59f49c4-92ba-5cfc-cf15-f8204g073f71' 
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({ 
    description: 'ID da alternativa selecionada',
    example: 'c69g59d5-03cb-6dfd-dg26-g9315h184g82' 
  })
  @IsNotEmpty()
  @IsString()
  alternative_id: string;

  @ApiPropertyOptional({ 
    description: 'Tempo gasto para responder em segundos',
    example: 30 
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  response_time?: number;

  @ApiPropertyOptional({ 
    description: 'ID da coleção (quando a resposta é no contexto de uma coleção)',
    example: 'd79h69e6-14dc-7ege-eh37-h0426i295h93' 
  })
  @IsOptional()
  @IsString()
  collection_id?: string;
}
