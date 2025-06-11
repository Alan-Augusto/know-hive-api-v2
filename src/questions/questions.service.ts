import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class QuestionsService {

  constructor( private prisma: PrismaService){}

  create(createQuestionDto: CreateQuestionDto) {
    // TODO: VERIFY IF TYPE EXISTS IN THE DATABASE
    const { type, author_id, ...rest } = createQuestionDto;
    return this.prisma.question.create({
      data: {
        ...rest,
        type: type ? { connect: { id: type } } : undefined,
        author: author_id ? { connect: { id: author_id } } : undefined
      }
    });
  }

  findAll() {
    return this.prisma.question.findMany({
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.question.findUnique({
      where: {
        id
      },
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true
          }
        }
      }
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const { type, author_id, ...rest } = updateQuestionDto;
    return this.prisma.question.update({
      where: {
        id
      },
      data: {
        ...rest,
        type: type ? { connect: { id: type } } : undefined,
        author: author_id ? { connect: { id: author_id } } : undefined
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


  findByUser(userId: string) {
    return this.prisma.question.findMany({
      where: {
        author_id: userId
      },
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true
          }
        }
      }
    });
  }
}
