import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionWithAlternativesDto } from './dto/create-question-with-alternatives.dto';
import { LikeQuestionDto } from './dto/like-question.dto';
import { SearchQuestionsDto } from './dto/search-questions.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class QuestionsService {

  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService
  ) { }
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
  async createOrUpdateWithAlternatives(createQuestionWithAlternativesDto: CreateQuestionWithAlternativesDto) {
    const { id, alternatives, tags, type, author_id, ...questionData } = createQuestionWithAlternativesDto;

    // Create or update question and alternatives in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      let question;

      if (id) {
        // Delete existing alternatives if updating
        await prisma.alternative.deleteMany({
          where: { question_id: id }
        });

        // Update existing question (without alternatives and tags)
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

    // Gerenciar tags após a transação principal
    if (tags !== undefined) {
      await this.tagsService.assignTagsToQuestionByNames(result.id, tags);
    }

    // Return the created/updated question with alternatives and tags
    return await this.prisma.question.findUnique({
      where: { id: result.id },
      include: {
        alternatives: true,
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            profile_picture: true
          }
        },
        tags: {
          include: {
            tag: true
          },
          orderBy: {
            tag: {
              name: 'asc'
            }
          }
        }
      }
    });
  }

  findAll() {
    return this.prisma.question.findMany();
  }

  async findAllForUser(userId: string) {
    const questions = await this.prisma.question.findMany({
      where: {
        is_public: true
      },
      include: {
        type: true,
        author: {
          select: {
            name: true,
            profile_picture: true
          }
        },
        likes: {
          where: {
            user_id: userId
          },
          select: {
            id: true
          }
        }
      }
    });

    return questions.map(q => ({
      ...q,
      is_liked: q.likes.length > 0,
      likes: undefined // remove likes array from response
    }));
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
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
        alternatives: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!question) return null;

    return {
      ...question,
      tags: question.tags.map((t: any) => t.tag.name)
    };
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
          },
          // Questões que o usuário deu like (mesmo que não sejam públicas)
          {
            likes: {
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
        },
        likes: {
          where: {
            user_id: userId
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    }).then(questions => 
      questions.map(question => ({
        ...question,
        is_liked: question.likes.length > 0,
        likes_count: question._count.likes,
        shared_with_me: question.author_id !== userId && question.permissions.length > 0,
        likes: undefined, // Remove likes array from response
        _count: undefined // Remove _count from response
      }))
    );
  }

  async like(likeQuestionDto: LikeQuestionDto) {
    const { user_id, question_id } = likeQuestionDto;

    // Check if like already exists
    const existingLike = await this.prisma.questionLike.findUnique({
      where: {
        user_id_question_id: {
          user_id,
          question_id
        }
      }
    });

    if (existingLike) {
      // Unlike - remove the like
      await this.prisma.questionLike.delete({
        where: {
          user_id_question_id: {
            user_id,
            question_id
          }
        }
      });
      return { liked: false, message: 'Like removido com sucesso' };
    } else {
      // Like - add the like
      await this.prisma.questionLike.create({
        data: {
          user_id,
          question_id
        }
      });
      return { liked: true, message: 'Like adicionado com sucesso' };
    }
  }

  async searchPublicQuestions(searchQuestionsDto: SearchQuestionsDto) {
    const { searchTerm, userId } = searchQuestionsDto;

    const questions = await this.prisma.question.findMany({
      where: {
        AND: [
          {
            is_public: true,
          },
          {
            author_id: {
              not: userId,
            },
          },
          {
            OR: [
              {
                title: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                statement: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                tags: {
                  some: {
                    tag: {
                      name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        type: true,
        tags: {
          include: {
            tag: true,
          },
        },
        alternatives: true,
        likes: {
          where: {
            user_id: userId,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            responses: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return questions.map(question => ({
      ...question,
      is_liked: question.likes.length > 0,
      tags: question.tags.map((t: any) => t.tag.name),
      likes: undefined, // Remove likes array from response
    }));
  }
}
