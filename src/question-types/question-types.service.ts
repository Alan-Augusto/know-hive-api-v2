import { Injectable } from '@nestjs/common';
import { CreateQuestionTypeDto } from './dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from './dto/update-question-type.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class QuestionTypesService {

  constructor(private prisma: PrismaService) {}

  create(createQuestionTypeDto: CreateQuestionTypeDto) {
    return this.prisma.questionType.create({data: createQuestionTypeDto});
  }

  findAll() {
    return this.prisma.questionType.findMany();
  }

  findOne(id: number) {
    return this.prisma.questionType.findUnique({
      where: { id }
    });
  }

  update(id: number, updateQuestionTypeDto: UpdateQuestionTypeDto) {
    return this.prisma.questionType.update({
      where: { id },
      data: updateQuestionTypeDto,
    });
  }

  remove(id: number) {
    return this.prisma.questionType.delete({
      where: { id },
    });
  }
}
