import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionWithAlternativesDto } from './dto/create-question-with-alternatives.dto';
import { LikeQuestionDto } from './dto/like-question.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  @Post()
  @ApiBody({ type: CreateQuestionDto })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Post('with-alternatives')
  @ApiBody({ type: CreateQuestionWithAlternativesDto })
  createWithAlternatives(@Body() createQuestionWithAlternativesDto: CreateQuestionWithAlternativesDto) {
    return this.questionsService.createWithAlternatives(createQuestionWithAlternativesDto);
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }
  
  @Get('all-for-user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.questionsService.findAllForUser(userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.questionsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateQuestionDto })
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
  @Post('like')
  @ApiBody({ type: LikeQuestionDto })
  like(@Body() likeQuestionDto: LikeQuestionDto) {
    return this.questionsService.like(likeQuestionDto);
  }
}
