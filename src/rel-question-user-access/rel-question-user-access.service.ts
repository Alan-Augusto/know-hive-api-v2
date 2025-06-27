import { Injectable } from '@nestjs/common';
import { CreateRelQuestionUserAccessDto } from './dto/create-rel-question-user-access.dto';
import { UpdateRelQuestionUserAccessDto } from './dto/update-rel-question-user-access.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RelQuestionUserAccessService {

  constructor( private prisma: PrismaService){}

  create(createRelQuestionUserAccessDto: CreateRelQuestionUserAccessDto) {
    return this.prisma.questionUserAccess.create({
      data: createRelQuestionUserAccessDto,
    });
  }

  findAll() {
    return this.prisma.questionUserAccess.findMany({
      include: {
        user: true,
        question: true,
        permission_type: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.questionUserAccess.findUnique({
      where: { id: id.toString() },
      include: {
        user: true,
        question: true,
        permission_type: true,
      },
    });
  }

  update(id: string, updateRelQuestionUserAccessDto: UpdateRelQuestionUserAccessDto) {
    return this.prisma.questionUserAccess.update({
      where: { id: id.toString() },
      data: updateRelQuestionUserAccessDto,
    });
  }

  remove(id: string) {
    return this.prisma.questionUserAccess.delete({
      where: { id: id.toString() },
    });
  }

  findAllByQuestion(questionId: string) {
    return this.prisma.questionUserAccess.findMany({
      where: { question_id: questionId.toString() },
      include: {
        user: true,
        question: true,
        permission_type: true,
      },
    });
  }

  async grantAccess(giverUserId: string, questionId:string, receiverEmail: string, accessTypeId: number) {
    const receiver = await this.prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      throw new Error('Receiver user not found');
    }

    return this.prisma.questionUserAccess.create({
      data: {
        user_id: receiver.id,
        question_id: questionId,
        permission_type_id: accessTypeId,
      },
    });
  }

}
