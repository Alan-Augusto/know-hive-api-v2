import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class QuestionsService {

  constructor( private prisma: PrismaService){}

  create(createQuestionDto: CreateQuestionDto) {
    // TODO: VERIFY IF TYPE EXISTS IN THE DATABASE
    const { type, ...rest } = createQuestionDto;
    return this.prisma.question.create({
      data: {
        ...rest,
        type: type ? { connect: { id: type } } : undefined
      }
    });
  }

  findAll() {
    return this.prisma.question.findMany();
  }

  findOne(id: string) {
    return this.prisma.question.findUnique({
      where: {
        id
      }
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const { type, ...rest } = updateQuestionDto;
    return this.prisma.question.update({
      where: {
        id
      },
      data: {
        ...rest,
        type: type ? { connect: { id: type } } : undefined
      }
    });
  }

  remove(id: string) {
    return this.prisma.question.delete({
      where: {
        id
      }
    });
  }
}
