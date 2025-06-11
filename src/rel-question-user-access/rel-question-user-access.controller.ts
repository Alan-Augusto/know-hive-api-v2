import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelQuestionUserAccessService } from './rel-question-user-access.service';
import { CreateRelQuestionUserAccessDto } from './dto/create-rel-question-user-access.dto';
import { UpdateRelQuestionUserAccessDto } from './dto/update-rel-question-user-access.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('rel-question-user-access')
@Controller('rel-question-user-access')
export class RelQuestionUserAccessController {
  constructor(private readonly relQuestionUserAccessService: RelQuestionUserAccessService) {}

  @Post()
  @ApiBody({ type: CreateRelQuestionUserAccessDto })
  create(@Body() createRelQuestionUserAccessDto: CreateRelQuestionUserAccessDto) {
    return this.relQuestionUserAccessService.create(createRelQuestionUserAccessDto);
  }

  @Get()
  findAll() {
    return this.relQuestionUserAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relQuestionUserAccessService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateRelQuestionUserAccessDto })
  update(@Param('id') id: string, @Body() updateRelQuestionUserAccessDto: UpdateRelQuestionUserAccessDto) {
    return this.relQuestionUserAccessService.update(id, updateRelQuestionUserAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relQuestionUserAccessService.remove(id);
  }

  @Get('question/:questionId')
  findAllByQuestion(@Param('questionId') questionId: string) {
    return this.relQuestionUserAccessService.findAllByQuestion(questionId);
  }

  @Post('grant-access')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        giverUserId: { type: 'string' },
        questionId: { type: 'string' },
        receiverEmail: { type: 'string', format: 'email' },
        accessTypeId: { type: 'number' },
      },
      required: ['giverUserId', 'questionId', 'receiverEmail', 'accessTypeId'],
    },
  })
  grantAccess(
    @Body('giverUserId') giverUserId: string,
    @Body('questionId') questionId: string,
    @Body('receiverEmail') receiverEmail: string,
    @Body('accessTypeId') accessTypeId: number,
  ) {
    return this.relQuestionUserAccessService.grantAccess(giverUserId, questionId, receiverEmail, accessTypeId);
  }

}
