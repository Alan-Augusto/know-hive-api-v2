import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { QuestionResponseService } from './question-response.service';
import { CreateQuestionResponseDto } from './dto/create-question-response.dto';
import { UpdateQuestionResponseDto } from './dto/update-question-response.dto';
import { GetResponsesQueryDto } from './dto/get-responses-query.dto';
import { GetUserStatsDto } from './dto/get-user-stats.dto';

@ApiTags('question-responses')
@Controller('question-responses')
export class QuestionResponseController {
  constructor(private readonly questionResponseService: QuestionResponseService) {}

  @Post()
  @ApiBody({ type: CreateQuestionResponseDto })
  create(@Body() createQuestionResponseDto: CreateQuestionResponseDto) {
    return this.questionResponseService.create(createQuestionResponseDto);
  }

  @Get()
  @ApiQuery({ type: GetResponsesQueryDto })
  findAll(@Query() query: GetResponsesQueryDto) {
    return this.questionResponseService.findAll(query);
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  findByUser(@Param('userId') userId: string) {
    return this.questionResponseService.findByUser(userId);
  }

  @Get('question/:questionId')
  @ApiParam({ name: 'questionId', description: 'ID da questão' })
  findByQuestion(@Param('questionId') questionId: string) {
    return this.questionResponseService.findByQuestion(questionId);
  }

  @Get('collection/:collectionId')
  @ApiParam({ name: 'collectionId', description: 'ID da coleção' })
  findByCollection(@Param('collectionId') collectionId: string) {
    return this.questionResponseService.findByCollection(collectionId);
  }

  @Get('stats/user/:userId')
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiQuery({ type: GetUserStatsDto })
  getUserStats(@Param('userId') userId: string, @Query() query: GetUserStatsDto) {
    return this.questionResponseService.getUserStats(userId, query);
  }

  @Get('stats/question/:questionId')
  @ApiParam({ name: 'questionId', description: 'ID da questão' })
  getQuestionStats(@Param('questionId') questionId: string) {
    return this.questionResponseService.getQuestionStats(questionId);
  }

  @Get('stats/collection/:collectionId')
  @ApiParam({ name: 'collectionId', description: 'ID da coleção' })
  getCollectionStats(@Param('collectionId') collectionId: string) {
    return this.questionResponseService.getCollectionStats(collectionId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  findOne(@Param('id') id: string) {
    return this.questionResponseService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  @ApiBody({ type: UpdateQuestionResponseDto })
  update(@Param('id') id: string, @Body() updateQuestionResponseDto: UpdateQuestionResponseDto) {
    return this.questionResponseService.update(id, updateQuestionResponseDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID da resposta' })
  remove(@Param('id') id: string) {
    return this.questionResponseService.remove(id);
  }
}
