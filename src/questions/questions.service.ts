import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionWithAlternativesDto } from './dto/create-question-with-alternatives.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class QuestionsService {

  constructor(private prisma: PrismaService) { }
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

  async createWithAlternatives(createQuestionWithAlternativesDto: CreateQuestionWithAlternativesDto) {
    const { id, alternatives, type, author_id, ...questionData } = createQuestionWithAlternativesDto;

    // Create or update question and alternatives in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      let question;

      if (id) {
        // Delete existing alternatives if updating
        await prisma.alternative.deleteMany({
          where: { question_id: id }
        });

        // Update existing question (without alternatives)
        question = await prisma.question.update({
          where: { id },
          data: {
            ...questionData,
            type: type ? { connect: { id: type } } : undefined,
            author: author_id ? { connect: { id: author_id } } : undefined
          }
        });
      } 
      else {
        // Create new question
        question = await prisma.question.create({
          data: {
            ...questionData,
            type: type ? { connect: { id: type } } : undefined,
            author: author_id ? { connect: { id: author_id } } : undefined
          }
        });
      }

      // Create the alternatives
      const createdAlternatives = await Promise.all(
        alternatives.map(alternative =>
          prisma.alternative.create({
            data: {
              text: alternative.text,
              is_correct: alternative.is_correct,
              question: {
                connect: { id: question.id }
              }
            }
          })
        )
      );

      return {
        ...question,
        alternatives: createdAlternatives
      };
    });

    return result;
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
        },
        alternatives: true
      }
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const { type, author_id, alternatives, ...rest } = updateQuestionDto;
    
    return this.prisma.$transaction(async (prisma) => {
      // Update the question (without alternatives)
      const question = await prisma.question.update({
        where: { id },
        data: {
          ...rest,
          type: type ? { connect: { id: type } } : undefined,
          author: author_id ? { connect: { id: author_id } } : undefined
        }
      });

      // If alternatives are provided, update them
      if (alternatives && alternatives.length > 0) {
        // Delete existing alternatives
        await prisma.alternative.deleteMany({
          where: { question_id: id }
        });

        // Create new alternatives
        const createdAlternatives = await Promise.all(
          alternatives.map(alternative =>
            prisma.alternative.create({
              data: {
                text: alternative.text,
                is_correct: alternative.is_correct,
                question: {
                  connect: { id: question.id }
                }
              }
            })
          )
        );

        return {
          ...question,
          alternatives: createdAlternatives
        };
      }

      return question;
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
        OR: [
          // Questões criadas pelo usuário
          {
            author_id: userId
          },
          // Questões compartilhadas com o usuário
          {
            permissions: {
              some: {
                user_id: userId
              }
            }
          }
        ]
      },
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true
          }
        },
        permissions: {
          where: {
            user_id: userId
          },
          include: {
            permission_type: true
          }
        }
      }
    });
  }
}
