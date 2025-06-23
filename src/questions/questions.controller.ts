import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionWithAlternativesDto } from './dto/create-question-with-alternatives.dto';
import { LikeQuestionDto } from './dto/like-question.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags/tags.service';
import { AssignTagsDto } from '../tags/dto/assign-tags.dto';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly tagsService: TagsService,
  ) {}
  @Post()
  @ApiBody({ type: CreateQuestionDto })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Post('with-alternatives')
  @ApiBody({ type: CreateQuestionWithAlternativesDto })
  createOrUpdateWithAlternatives(@Body() createQuestionWithAlternativesDto: CreateQuestionWithAlternativesDto) {
    return this.questionsService.createOrUpdateWithAlternatives(createQuestionWithAlternativesDto);
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
  }  @Post('like')
  @ApiBody({ type: LikeQuestionDto })
  like(@Body() likeQuestionDto: LikeQuestionDto) {
    return this.questionsService.like(likeQuestionDto);
  }

  @Post(':id/tags')
  @ApiBody({ type: AssignTagsDto })
  assignTags(@Param('id') id: string, @Body() assignTagsDto: AssignTagsDto) {
    return this.tagsService.assignTagsToQuestion(id, assignTagsDto.tagIds);
  }

  @Get(':id/tags')
  getTags(@Param('id') id: string) {
    return this.tagsService.getQuestionTags(id);
  }

  @Delete(':id/tags/:tagId')
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.tagsService.removeTagFromQuestion(id, tagId);
  }
}
