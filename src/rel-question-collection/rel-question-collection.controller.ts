import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelQuestionCollectionService } from './rel-question-collection.service';
import { CreateRelQuestionCollectionDto } from './dto/create-rel-question-collection.dto';
import { UpdateRelQuestionCollectionDto } from './dto/update-rel-question-collection.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('rel-question-collection')
@Controller('rel-question-collection')
export class RelQuestionCollectionController {
  constructor(private readonly relQuestionCollectionService: RelQuestionCollectionService) {}

  @Post()
  @ApiBody({ type: CreateRelQuestionCollectionDto })
  create(@Body() createRelQuestionCollectionDto: CreateRelQuestionCollectionDto) {
    return this.relQuestionCollectionService.create(createRelQuestionCollectionDto);
  }

  @Get()
  findAll() {
    return this.relQuestionCollectionService.findAll();
  }

  @Get(':question_id/:collection_id')
  findOne(@Param('question_id') question_id: string, @Param('collection_id') collection_id: string) {
    return this.relQuestionCollectionService.findOne(question_id, collection_id);
  }

  @Patch(':question_id/:collection_id')
  @ApiBody({ type: UpdateRelQuestionCollectionDto })
  update(@Param('question_id') question_id: string, @Param('collection_id') collection_id: string, @Body() updateRelQuestionCollectionDto: UpdateRelQuestionCollectionDto) {
    return this.relQuestionCollectionService.update(question_id, collection_id, updateRelQuestionCollectionDto);
  }

  @Delete(':question_id/:collection_id')
  remove(@Param('question_id') question_id: string, @Param('collection_id') collection_id: string) {
    return this.relQuestionCollectionService.remove(question_id, collection_id);
  }
}
