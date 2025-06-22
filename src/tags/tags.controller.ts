import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagsDto } from './dto/assign-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('search')
  searchByName(@Query('name') name: string) {
    return this.tagsService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Get(':id/collections')
  getCollectionsByTag(@Param('id') id: string) {
    return this.tagsService.getCollectionsByTag(id);
  }

  @Get(':id/questions')
  getQuestionsByTag(@Param('id') id: string) {
    return this.tagsService.getQuestionsByTag(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }

  // Endpoints para gerenciar tags em coleções
  @Post('collections/:collectionId/assign')
  assignTagsToCollection(
    @Param('collectionId') collectionId: string,
    @Body() assignTagsDto: AssignTagsDto,
  ) {
    return this.tagsService.assignTagsToCollection(
      collectionId,
      assignTagsDto.tagIds,
    );
  }

  @Get('collections/:collectionId')
  getCollectionTags(@Param('collectionId') collectionId: string) {
    return this.tagsService.getCollectionTags(collectionId);
  }

  @Delete('collections/:collectionId/tags/:tagId')
  removeTagFromCollection(
    @Param('collectionId') collectionId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.removeTagFromCollection(collectionId, tagId);
  }

  // Endpoints para gerenciar tags em questões
  @Post('questions/:questionId/assign')
  assignTagsToQuestion(
    @Param('questionId') questionId: string,
    @Body() assignTagsDto: AssignTagsDto,
  ) {
    return this.tagsService.assignTagsToQuestion(
      questionId,
      assignTagsDto.tagIds,
    );
  }

  @Get('questions/:questionId')
  getQuestionTags(@Param('questionId') questionId: string) {
    return this.tagsService.getQuestionTags(questionId);
  }

  @Delete('questions/:questionId/tags/:tagId')
  removeTagFromQuestion(
    @Param('questionId') questionId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.removeTagFromQuestion(questionId, tagId);
  }
}
