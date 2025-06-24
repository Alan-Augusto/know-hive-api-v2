import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateQuestionResponseDto } from './dto/create-question-response.dto';
import { UpdateQuestionResponseDto } from './dto/update-question-response.dto';
import { GetResponsesQueryDto } from './dto/get-responses-query.dto';
import { GetUserStatsDto } from './dto/get-user-stats.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class QuestionResponseService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionResponseDto: CreateQuestionResponseDto) {
    const { question_id, user_id, alternative_ids, collection_id, response_time, attempt_number, is_final } = createQuestionResponseDto;

    // Verificar se a questão existe
    const question = await this.prisma.question.findUnique({
      where: { id: question_id },
      include: {
        type: true, // Incluir o tipo para validações específicas
      },
    });

    if (!question) {
      throw new NotFoundException(`Questão com ID ${question_id} não encontrada`);
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${user_id} não encontrado`);
    }

    // Verificar se todas as alternativas existem e pertencem à questão
    const alternatives = await this.prisma.alternative.findMany({
      where: { 
        id: { in: alternative_ids },
        question_id: question_id,
      },
    });

    if (alternatives.length !== alternative_ids.length) {
      throw new BadRequestException(`Uma ou mais alternativas não foram encontradas ou não pertencem à questão ${question_id}`);
    }

    // Validação específica por tipo de questão
    if (question.type.name === 'Verdadeiro ou Falso' && alternative_ids.length > 1) {
      throw new BadRequestException('Questões de Verdadeiro ou Falso devem ter apenas uma alternativa selecionada');
    }

    // Se collection_id foi fornecido, verificar se existe
    if (collection_id) {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collection_id },
      });

      if (!collection) {
        throw new NotFoundException(`Coleção com ID ${collection_id} não encontrada`);
      }
    }

    // Se attempt_number não foi fornecido, calcular automaticamente
    let finalAttemptNumber = attempt_number;
    if (!finalAttemptNumber) {
      const lastResponse = await this.prisma.questionResponse.findFirst({
        where: {
          user_id,
          question_id,
          collection_id,
        },
        orderBy: {
          answered_at: 'desc',
        },
        select: {
          attempt_number: true,
        },
      });
      finalAttemptNumber = lastResponse ? lastResponse.attempt_number + 1 : 1;
    }

    // Se is_final for true, marcar todas as respostas anteriores como não finais
    if (is_final) {
      await this.prisma.questionResponse.updateMany({
        where: {
          user_id,
          question_id,
          collection_id,
          is_final: true,
        },
        data: {
          is_final: false,
        },
      });
    }

    // Criar a resposta principal
    const questionResponse = await this.prisma.questionResponse.create({
      data: {
        question_id,
        user_id,
        collection_id,
        response_time,
        attempt_number: finalAttemptNumber,
        is_final: is_final || false,
      },
    });

    // Criar as relações com as alternativas selecionadas
    const responseAlternatives = await Promise.all(
      alternative_ids.map(alternative_id =>
        this.prisma.responseAlternative.create({
          data: {
            response_id: questionResponse.id,
            alternative_id,
          },
        })
      )
    );

    // Buscar a resposta completa com todas as relações
    const completeResponse = await this.prisma.questionResponse.findUnique({
      where: { id: questionResponse.id },
      include: {
        question: {
          select: {
            id: true,
            statement: true,
            title: true,
            type: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
        collection: collection_id ? {
          select: {
            id: true,
            title: true,
          },
        } : false,
      },
    });

    // Calcular se a resposta está correta
    const selectedAlternatives = completeResponse.selected_alternatives.map(sa => sa.alternative);
    const correctAlternatives = alternatives.filter(alt => alt.is_correct);
    
    // Para questões de múltipla escolha, todas as alternativas corretas devem ser selecionadas
    // e nenhuma incorreta deve ser selecionada
    const isCorrect = correctAlternatives.length === selectedAlternatives.filter(alt => alt.is_correct).length &&
                      selectedAlternatives.every(alt => alt.is_correct);

    return {
      ...completeResponse,
      alternatives: selectedAlternatives,
      is_correct: isCorrect,
      correct_alternatives_count: correctAlternatives.length,
      selected_correct_count: selectedAlternatives.filter(alt => alt.is_correct).length,
    };
  }

  async findAll(query: GetResponsesQueryDto) {
    const { user_id, question_id, collection_id } = query;
    const where: any = {};

    if (user_id) where.user_id = user_id;
    if (question_id) where.question_id = question_id;
    if (collection_id) where.collection_id = collection_id;

    const responses = await this.prisma.questionResponse.findMany({
      where,
      include: {
        question: {
          select: {
            id: true,
            statement: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        answered_at: 'desc',
      },
    });

    return responses.map(response => {
      const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
      const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                       selectedAlternatives.length > 0;
      
      return {
        ...response,
        alternatives: selectedAlternatives,
        is_correct: isCorrect,
      };
    });
  }

  async findOne(id: string) {
    const response = await this.prisma.questionResponse.findUnique({
      where: { id },
      include: {
        question: {
          select: {
            id: true,
            statement: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
    }

    const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
    const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                     selectedAlternatives.length > 0;

    return {
      ...response,
      alternatives: selectedAlternatives,
      is_correct: isCorrect,
    };
  }

  async findByUser(userId: string) {
    const responses = await this.prisma.questionResponse.findMany({
      where: { user_id: userId },
      include: {
        question: {
          select: {
            id: true,
            statement: true,
            title: true,
          },
        },
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        answered_at: 'desc',
      },
    });

    return responses.map(response => {
      const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
      const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                       selectedAlternatives.length > 0;
      
      return {
        ...response,
        alternatives: selectedAlternatives,
        is_correct: isCorrect,
      };
    });
  }

  async update(id: string, updateQuestionResponseDto: UpdateQuestionResponseDto) {
    const existingResponse = await this.prisma.questionResponse.findUnique({
      where: { id },
      include: {
        selected_alternatives: true,
      },
    });

    if (!existingResponse) {
      throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
    }

    const { alternative_ids, ...otherUpdates } = updateQuestionResponseDto;

    // Se está tentando atualizar as alternativas
    if (alternative_ids && alternative_ids.length > 0) {
      // Verificar se todas as alternativas pertencem à questão
      const alternatives = await this.prisma.alternative.findMany({
        where: { 
          id: { in: alternative_ids },
          question_id: existingResponse.question_id,
        },
      });

      if (alternatives.length !== alternative_ids.length) {
        throw new BadRequestException(`Uma ou mais alternativas não foram encontradas ou não pertencem à questão`);
      }

      // Remover alternativas antigas
      await this.prisma.responseAlternative.deleteMany({
        where: { response_id: id },
      });

      // Adicionar novas alternativas
      await Promise.all(
        alternative_ids.map(alternative_id =>
          this.prisma.responseAlternative.create({
            data: {
              response_id: id,
              alternative_id,
            },
          })
        )
      );
    }

    // Se está tentando atualizar a coleção, verificar se existe
    if (updateQuestionResponseDto.collection_id) {
      const collection = await this.prisma.collection.findUnique({
        where: { id: updateQuestionResponseDto.collection_id },
      });

      if (!collection) {
        throw new NotFoundException(`Coleção com ID ${updateQuestionResponseDto.collection_id} não encontrada`);
      }
    }

    const updatedResponse = await this.prisma.questionResponse.update({
      where: { id },
      data: otherUpdates,
      include: {
        question: {
          select: {
            id: true,
            statement: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const selectedAlternatives = updatedResponse.selected_alternatives.map(sa => sa.alternative);
    const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                     selectedAlternatives.length > 0;

    return {
      ...updatedResponse,
      alternatives: selectedAlternatives,
      is_correct: isCorrect,
    };
  }

  async remove(id: string) {
    const existingResponse = await this.prisma.questionResponse.findUnique({
      where: { id },
    });

    if (!existingResponse) {
      throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
    }

    // As relações com alternativas serão removidas automaticamente devido ao onDelete: Cascade
    await this.prisma.questionResponse.delete({
      where: { id },
    });

    return { message: `Resposta com ID ${id} removida com sucesso` };
  }

  // Métodos para estatísticas
  async getUserStats(userId: string, query: GetUserStatsDto) {
    const { collection_id } = query;
    const where: any = { user_id: userId };
    
    if (collection_id) {
      where.collection_id = collection_id;
    }

    const responses = await this.prisma.questionResponse.findMany({
      where,
      include: {
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                is_correct: true,
              },
            },
          },
        },
      },
    });

    const totalResponses = responses.length;
    let correctResponses = 0;

    responses.forEach(response => {
      const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
      const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                       selectedAlternatives.length > 0;
      if (isCorrect) correctResponses++;
    });

    const totalTime = responses.reduce((sum, r) => sum + (r.response_time || 0), 0);
    const averageTime = totalResponses > 0 ? totalTime / totalResponses : 0;

    return {
      user_id: userId,
      collection_id: collection_id || null,
      total_responses: totalResponses,
      correct_responses: correctResponses,
      incorrect_responses: totalResponses - correctResponses,
      accuracy_percentage: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
      total_time_seconds: totalTime,
      average_time_seconds: averageTime,
    };
  }

  async getQuestionStats(questionId: string) {
    const responses = await this.prisma.questionResponse.findMany({
      where: { question_id: questionId },
      include: {
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
      },
    });

    const totalResponses = responses.length;
    let correctResponses = 0;

    responses.forEach(response => {
      const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
      const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                       selectedAlternatives.length > 0;
      if (isCorrect) correctResponses++;
    });

    const totalTime = responses.reduce((sum, r) => sum + (r.response_time || 0), 0);
    const averageTime = totalResponses > 0 ? totalTime / totalResponses : 0;

    // Estatísticas por alternativa
    const alternativeStats = {};
    responses.forEach(response => {
      response.selected_alternatives.forEach(sa => {
        const altId = sa.alternative.id;
        if (!alternativeStats[altId]) {
          alternativeStats[altId] = {
            alternative_id: altId,
            text: sa.alternative.text,
            is_correct: sa.alternative.is_correct,
            selection_count: 0,
          };
        }
        alternativeStats[altId].selection_count++;
      });
    });

    return {
      question_id: questionId,
      total_responses: totalResponses,
      correct_responses: correctResponses,
      incorrect_responses: totalResponses - correctResponses,
      accuracy_percentage: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
      total_time_seconds: totalTime,
      average_time_seconds: averageTime,
      alternative_stats: Object.values(alternativeStats),
    };
  }

  // Novos métodos específicos para múltiplas tentativas
  async getUserAttempts(userId: string, questionId: string, collectionId?: string) {
    const where: any = {
      user_id: userId,
      question_id: questionId,
    };

    if (collectionId) {
      where.collection_id = collectionId;
    }

    return this.prisma.questionResponse.findMany({
      where,
      include: {
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
      },
      orderBy: {
        attempt_number: 'asc',
      },
    });
  }

  async getFinalResponse(userId: string, questionId: string, collectionId?: string) {
    const where: any = {
      user_id: userId,
      question_id: questionId,
      is_final: true,
    };

    if (collectionId) {
      where.collection_id = collectionId;
    }

    const response = await this.prisma.questionResponse.findFirst({
      where,
      include: {
        selected_alternatives: {
          include: {
            alternative: {
              select: {
                id: true,
                text: true,
                is_correct: true,
              },
            },
          },
        },
      },
    });

    if (!response) {
      return null;
    }

    const selectedAlternatives = response.selected_alternatives.map(sa => sa.alternative);
    const isCorrect = selectedAlternatives.every(alt => alt.is_correct) && 
                     selectedAlternatives.length > 0;

    return {
      ...response,
      alternatives: selectedAlternatives,
      is_correct: isCorrect,
    };
  }
}
