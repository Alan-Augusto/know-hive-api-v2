import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionWithQuestionsDto } from './dto/create-collection-with-questions.dto';
import { LikeCollectionDto } from './dto/like-collection.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

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
}
