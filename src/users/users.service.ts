import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatisticsDto, RecentItemDto, TagStatisticDto } from './dto/user-statistics.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor( private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const encriptedPassword = await hash(createUserDto.password, 10);
    const userRegister: CreateUserDto = { ...createUserDto, password: encriptedPassword };
    return this.prisma.user.create({ data: userRegister });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: updateUserDto
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id: id
      }
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }

  async getUserStatistics(userId: string): Promise<UserStatisticsDto> {
    // Executar todas as consultas em paralelo para melhor performance
    const [
      questionsCreated,
      collectionsCreated,
      sharedItemsCount,
      favoritesCount,
      responseStats,
      recentQuestions,
      recentCollections,
      mostUsedTags,
      accessCounts
    ] = await Promise.all([
      this.getQuestionsCreatedCount(userId),
      this.getCollectionsCreatedCount(userId),
      this.getSharedItemsCount(userId),
      this.getFavoritesCount(userId),
      this.getResponseStatistics(userId),
      this.getRecentQuestions(userId),
      this.getRecentCollections(userId),
      this.getMostUsedTags(userId),
      this.getAccessCounts(userId)
    ]);

    return {
      questions_created: questionsCreated,
      collections_created: collectionsCreated,
      shared_items_count: sharedItemsCount,
      favorites_count: favoritesCount,
      total_responses: responseStats.total,
      correct_responses: responseStats.correct,
      accuracy_percentage: responseStats.accuracy,
      recent_questions: recentQuestions,
      recent_collections: recentCollections,
      most_used_tags: mostUsedTags,
      collections_with_access: accessCounts.collections,
      questions_with_access: accessCounts.questions
    };
  }

  private async getQuestionsCreatedCount(userId: string): Promise<number> {
    return this.prisma.question.count({
      where: { author_id: userId }
    });
  }

  private async getCollectionsCreatedCount(userId: string): Promise<number> {
    return this.prisma.collection.count({
      where: { author_id: userId }
    });
  }

  private async getSharedItemsCount(userId: string): Promise<number> {
    const [questionsShared, collectionsShared] = await Promise.all([
      this.prisma.questionUserAccess.count({
        where: { user_id: userId }
      }),
      this.prisma.collectionUserAccess.count({
        where: { user_id: userId }
      })
    ]);

    return questionsShared + collectionsShared;
  }

  private async getFavoritesCount(userId: string): Promise<number> {
    const [questionLikes, collectionLikes] = await Promise.all([
      this.prisma.questionLike.count({
        where: { user_id: userId }
      }),
      this.prisma.collectionLike.count({
        where: { user_id: userId }
      })
    ]);

    return questionLikes + collectionLikes;
  }

  private async getResponseStatistics(userId: string): Promise<{
    total: number;
    correct: number;
    accuracy: number;
  }> {
    // Buscar apenas respostas finais do usuário
    const responses = await this.prisma.questionResponse.findMany({
      where: {
        user_id: userId,
        is_final: true
      },
      include: {
        selected_alternatives: {
          include: {
            alternative: true
          }
        }
      }
    });

    const total = responses.length;
    let correct = 0;

    // Verificar quantas respostas estão corretas
    for (const response of responses) {
      const allCorrect = response.selected_alternatives.every(
        sa => sa.alternative.is_correct
      );
      const hasIncorrect = response.selected_alternatives.some(
        sa => !sa.alternative.is_correct
      );

      if (allCorrect && !hasIncorrect) {
        correct++;
      }
    }

    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    return {
      total,
      correct,
      accuracy: Math.round(accuracy * 100) / 100 // Arredondar para 2 casas decimais
    };
  }

  private async getRecentQuestions(userId: string): Promise<RecentItemDto[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        OR: [
          { author_id: userId }, // Questões criadas pelo usuário
          { 
            permissions: {
              some: { user_id: userId }
            }
          }, // Questões compartilhadas com o usuário
          { is_public: true } // Questões públicas
        ]
      },
      include: {
        author: {
          select: { name: true, profile_picture: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    return questions.map(question => ({
      id: question.id,
      title: question.title,
      created_at: question.created_at,
      author_name: question.author.name,
      profile_picture: question.author.profile_picture,
      type: 'question' as const,
      is_owned: question.author_id === userId
    }));
  }

  private async getRecentCollections(userId: string): Promise<RecentItemDto[]> {
    const collections = await this.prisma.collection.findMany({
      where: {
        OR: [
          { author_id: userId }, // Coleções criadas pelo usuário
          { 
            permissions: {
              some: { user_id: userId }
            }
          }, // Coleções compartilhadas com o usuário
          { is_public: true } // Coleções públicas
        ]
      },
      include: {
        author: {
          select: { name: true, profile_picture: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    return collections.map(collection => ({
      id: collection.id,
      title: collection.title,
      created_at: collection.created_at,
      author_name: collection.author.name,
      profile_picture: collection.author.profile_picture,
      type: 'collection' as const,
      is_owned: collection.author_id === userId
    }));
  }

  private async getMostUsedTags(userId: string): Promise<TagStatisticDto[]> {
    // Buscar tags de questões do usuário
    const questionTags = await this.prisma.questionTag.findMany({
      where: {
        question: { author_id: userId }
      },
      include: {
        tag: true
      }
    });

    // Buscar tags de coleções do usuário
    const collectionTags = await this.prisma.collectionTag.findMany({
      where: {
        collection: { author_id: userId }
      },
      include: {
        tag: true
      }
    });

    // Contar a frequência de cada tag
    const tagCounts = new Map<string, { id: string; name: string; count: number }>();

    [...questionTags, ...collectionTags].forEach(item => {
      const tag = item.tag;
      const existing = tagCounts.get(tag.id);
      
      if (existing) {
        existing.count++;
      } else {
        tagCounts.set(tag.id, {
          id: tag.id,
          name: tag.name,
          count: 1
        });
      }
    });

    // Converter para array e ordenar por contagem (descendente)
    return Array.from(tagCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(tag => ({
        id: tag.id,
        name: tag.name,
        usage_count: tag.count
      }));
  }

  private async getAccessCounts(userId: string): Promise<{
    collections: number;
    questions: number;
  }> {
    const [collectionsAccess, questionsAccess] = await Promise.all([
      this.prisma.collectionUserAccess.count({
        where: { user_id: userId }
      }),
      this.prisma.questionUserAccess.count({
        where: { user_id: userId }
      })
    ]);

    return {
      collections: collectionsAccess,
      questions: questionsAccess
    };
  }
}
