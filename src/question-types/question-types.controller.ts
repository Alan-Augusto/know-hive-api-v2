import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionTypesService } from './question-types.service';
import { CreateQuestionTypeDto } from './dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from './dto/update-question-type.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('question-types')
@Controller('question-types')
export class QuestionTypesController {
  constructor(private readonly questionTypesService: QuestionTypesService) {}

  @Post()
  @ApiBody({ type: CreateQuestionTypeDto })
  create(@Body() createQuestionTypeDto: CreateQuestionTypeDto) {
    return this.questionTypesService.create(createQuestionTypeDto);
  }

  @Get()
  findAll() {
    return this.questionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateQuestionTypeDto })
  update(@Param('id') id: string, @Body() updateQuestionTypeDto: UpdateQuestionTypeDto) {
    return this.questionTypesService.update(+id, updateQuestionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionTypesService.remove(+id);
  }
}
