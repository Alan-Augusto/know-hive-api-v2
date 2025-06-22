import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionWithQuestionsDto } from './dto/create-collection-with-questions.dto';
import { LikeCollectionDto } from './dto/like-collection.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags/tags.service';
import { AssignTagsDto } from '../tags/dto/assign-tags.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly tagsService: TagsService,
  ) {}

  @Post()
  @ApiBody({ type: CreateCollectionDto })
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Post('with-questions')
  @ApiBody({ type: CreateCollectionWithQuestionsDto })
  createOrUpdateWithQuestions(@Body() createCollectionWithQuestionsDto: CreateCollectionWithQuestionsDto) {
    return this.collectionsService.createOrUpdateWithQuestions(createCollectionWithQuestionsDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get('all-for-user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.collectionsService.findAllForUser(userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.collectionsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCollectionDto })
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
  @Post('like')
  @ApiBody({ type: LikeCollectionDto })
  like(@Body() likeCollectionDto: LikeCollectionDto) {
    return this.collectionsService.like(likeCollectionDto);
  }

  @Post(':id/tags')
  @ApiBody({ type: AssignTagsDto })
  assignTags(@Param('id') id: string, @Body() assignTagsDto: AssignTagsDto) {
    return this.tagsService.assignTagsToCollection(id, assignTagsDto.tagIds);
  }

  @Get(':id/tags')
  getTags(@Param('id') id: string) {
    return this.tagsService.getCollectionTags(id);
  }

  @Delete(':id/tags/:tagId')
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.tagsService.removeTagFromCollection(id, tagId);
  }
}
