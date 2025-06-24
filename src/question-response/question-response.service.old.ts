// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { CreateQuestionResponseDto } from './dto/create-question-response.dto';
// import { UpdateQuestionResponseDto } from './dto/update-question-response.dto';
// import { GetResponsesQueryDto } from './dto/get-responses-query.dto';
// import { GetUserStatsDto } from './dto/get-user-stats.dto';
// import { PrismaService } from 'src/database/prisma.service';

// @Injectable()
// export class QuestionResponseService {
//   constructor(private prisma: PrismaService) {}
//   async create(createQuestionResponseDto: CreateQuestionResponseDto) {
//     const { question_id, user_id, alternative_ids, collection_id, response_time, attempt_number, is_final } = createQuestionResponseDto;

//     // Verificar se a questão existe
//     const question = await this.prisma.question.findUnique({
//       where: { id: question_id },
//       include: {
//         type: true, // Incluir o tipo para validações específicas
//       },
//     });

//     if (!question) {
//       throw new NotFoundException(`Questão com ID ${question_id} não encontrada`);
//     }

//     // Verificar se o usuário existe
//     const user = await this.prisma.user.findUnique({
//       where: { id: user_id },
//     });

//     if (!user) {
//       throw new NotFoundException(`Usuário com ID ${user_id} não encontrado`);
//     }

//     // Verificar se todas as alternativas existem e pertencem à questão
//     const alternatives = await this.prisma.alternative.findMany({
//       where: { 
//         id: { in: alternative_ids },
//         question_id: question_id,
//       },
//     });

//     if (alternatives.length !== alternative_ids.length) {
//       throw new BadRequestException(`Uma ou mais alternativas não foram encontradas ou não pertencem à questão ${question_id}`);
//     }

//     // Validação específica por tipo de questão
//     if (question.type.name === 'Verdadeiro ou Falso' && alternative_ids.length > 1) {
//       throw new BadRequestException('Questões de Verdadeiro ou Falso devem ter apenas uma alternativa selecionada');
//     }

//     // Se collection_id foi fornecido, verificar se existe
//     if (collection_id) {
//       const collection = await this.prisma.collection.findUnique({
//         where: { id: collection_id },
//       });

//       if (!collection) {
//         throw new NotFoundException(`Coleção com ID ${collection_id} não encontrada`);
//       }
//     }    // Se attempt_number não foi fornecido, calcular automaticamente
//     let finalAttemptNumber = attempt_number;
//     if (!finalAttemptNumber) {
//       const lastResponse = await this.prisma.questionResponse.findFirst({
//         where: {
//           user_id,
//           question_id,
//           collection_id,
//         },
//         orderBy: {
//           answered_at: 'desc', // Usar answered_at em vez de attempt_number
//         },
//         select: {
//           attempt_number: true,
//         },
//       });
//       finalAttemptNumber = lastResponse ? lastResponse.attempt_number + 1 : 1;
//     }

//     // Se is_final for true, marcar todas as respostas anteriores como não finais
//     if (is_final) {
//       await this.prisma.questionResponse.updateMany({
//         where: {
//           user_id,
//           question_id,
//           collection_id,
//           is_final: true,
//         },
//         data: {
//           is_final: false,
//         },
//       });
//     }

//     // Criar a resposta principal
//     const questionResponse = await this.prisma.questionResponse.create({
//       data: {
//         question_id,
//         user_id,
//         collection_id,
//         response_time,
//         attempt_number: finalAttemptNumber,
//         is_final: is_final || false,
//       },
//     });

//     // Criar as relações com as alternativas selecionadas
//     const responseAlternatives = await Promise.all(
//       alternative_ids.map(alternative_id =>
//         this.prisma.responseAlternative.create({
//           data: {
//             response_id: questionResponse.id,
//             alternative_id,
//           },
//         })
//       )
//     );

//     // Buscar a resposta completa com todas as relações
//     const completeResponse = await this.prisma.questionResponse.findUnique({
//       where: { id: questionResponse.id },
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//             type: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         selected_alternatives: {
//           include: {
//             alternative: {
//               select: {
//                 id: true,
//                 text: true,
//                 is_correct: true,
//               },
//             },
//           },
//         },
//         collection: collection_id ? {
//           select: {
//             id: true,
//             title: true,
//           },
//         } : false,
//       },
//     });

//     // Calcular se a resposta está correta
//     const selectedAlternatives = completeResponse.selected_alternatives.map(sa => sa.alternative);
//     const correctAlternatives = alternatives.filter(alt => alt.is_correct);
    
//     // Para questões de múltipla escolha, todas as alternativas corretas devem ser selecionadas
//     // e nenhuma incorreta deve ser selecionada
//     const isCorrect = correctAlternatives.length === selectedAlternatives.filter(alt => alt.is_correct).length &&
//                       selectedAlternatives.every(alt => alt.is_correct);

//     return {
//       ...completeResponse,
//       alternatives: selectedAlternatives,
//       is_correct: isCorrect,
//       correct_alternatives_count: correctAlternatives.length,
//       selected_correct_count: selectedAlternatives.filter(alt => alt.is_correct).length,
//     };
//   }

//   async findAll(query: GetResponsesQueryDto) {
//     const { user_id, question_id, collection_id } = query;
//     const where: any = {};

//     if (user_id) where.user_id = user_id;
//     if (question_id) where.question_id = question_id;
//     if (collection_id) where.collection_id = collection_id;

//     const responses = await this.prisma.questionResponse.findMany({
//       where,
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//         collection: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         answered_at: 'desc',
//       },
//     });

//     return responses.map(response => ({
//       ...response,
//       is_correct: response.alternative.is_correct,
//     }));
//   }

//   async findOne(id: string) {
//     const response = await this.prisma.questionResponse.findUnique({
//       where: { id },
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//         collection: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//     });

//     if (!response) {
//       throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
//     }

//     return {
//       ...response,
//       is_correct: response.alternative.is_correct,
//     };
//   }

//   async findByUser(userId: string) {
//     const responses = await this.prisma.questionResponse.findMany({
//       where: { user_id: userId },
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//         collection: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         answered_at: 'desc',
//       },
//     });

//     return responses.map(response => ({
//       ...response,
//       is_correct: response.alternative.is_correct,
//     }));
//   }

//   async findByQuestion(questionId: string) {
//     const responses = await this.prisma.questionResponse.findMany({
//       where: { question_id: questionId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//         collection: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         answered_at: 'desc',
//       },
//     });

//     return responses.map(response => ({
//       ...response,
//       is_correct: response.alternative.is_correct,
//     }));
//   }

//   async findByCollection(collectionId: string) {
//     const responses = await this.prisma.questionResponse.findMany({
//       where: { collection_id: collectionId },
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//       },
//       orderBy: {
//         answered_at: 'desc',
//       },
//     });

//     return responses.map(response => ({
//       ...response,
//       is_correct: response.alternative.is_correct,
//     }));
//   }

//   async update(id: string, updateQuestionResponseDto: UpdateQuestionResponseDto) {
//     const existingResponse = await this.prisma.questionResponse.findUnique({
//       where: { id },
//     });

//     if (!existingResponse) {
//       throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
//     }

//     // Se está tentando atualizar a alternativa, verificar se ela pertence à questão
//     if (updateQuestionResponseDto.alternative_id) {
//       const alternative = await this.prisma.alternative.findFirst({
//         where: { 
//           id: updateQuestionResponseDto.alternative_id,
//           question_id: existingResponse.question_id,
//         },
//       });

//       if (!alternative) {
//         throw new BadRequestException(`Alternativa com ID ${updateQuestionResponseDto.alternative_id} não encontrada ou não pertence à questão`);
//       }
//     }

//     // Se está tentando atualizar a coleção, verificar se existe
//     if (updateQuestionResponseDto.collection_id) {
//       const collection = await this.prisma.collection.findUnique({
//         where: { id: updateQuestionResponseDto.collection_id },
//       });

//       if (!collection) {
//         throw new NotFoundException(`Coleção com ID ${updateQuestionResponseDto.collection_id} não encontrada`);
//       }
//     }

//     const updatedResponse = await this.prisma.questionResponse.update({
//       where: { id },
//       data: updateQuestionResponseDto,
//       include: {
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//         collection: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//     });

//     return {
//       ...updatedResponse,
//       is_correct: updatedResponse.alternative.is_correct,
//     };
//   }

//   async remove(id: string) {
//     const existingResponse = await this.prisma.questionResponse.findUnique({
//       where: { id },
//     });

//     if (!existingResponse) {
//       throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
//     }

//     await this.prisma.questionResponse.delete({
//       where: { id },
//     });

//     return { message: `Resposta com ID ${id} removida com sucesso` };
//   }

//   // Métodos para estatísticas
//   async getUserStats(userId: string, query: GetUserStatsDto) {
//     const { collection_id } = query;
//     const where: any = { user_id: userId };
    
//     if (collection_id) {
//       where.collection_id = collection_id;
//     }

//     const responses = await this.prisma.questionResponse.findMany({
//       where,
//       include: {
//         alternative: {
//           select: {
//             is_correct: true,
//           },
//         },
//       },
//     });

//     const totalResponses = responses.length;
//     const correctResponses = responses.filter(r => r.alternative.is_correct).length;
//     const totalTime = responses.reduce((sum, r) => sum + (r.response_time || 0), 0);
//     const averageTime = totalResponses > 0 ? totalTime / totalResponses : 0;

//     return {
//       user_id: userId,
//       collection_id: collection_id || null,
//       total_responses: totalResponses,
//       correct_responses: correctResponses,
//       incorrect_responses: totalResponses - correctResponses,
//       accuracy_percentage: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
//       total_time_seconds: totalTime,
//       average_time_seconds: averageTime,
//     };
//   }

//   async getQuestionStats(questionId: string) {
//     const responses = await this.prisma.questionResponse.findMany({
//       where: { question_id: questionId },
//       include: {
//         alternative: {
//           select: {
//             id: true,
//             text: true,
//             is_correct: true,
//           },
//         },
//       },
//     });

//     const totalResponses = responses.length;
//     const correctResponses = responses.filter(r => r.alternative.is_correct).length;
//     const totalTime = responses.reduce((sum, r) => sum + (r.response_time || 0), 0);
//     const averageTime = totalResponses > 0 ? totalTime / totalResponses : 0;

//     // Estatísticas por alternativa
//     const alternativeStats = responses.reduce((acc, response) => {
//       const altId = response.alternative.id;
//       if (!acc[altId]) {
//         acc[altId] = {
//           alternative_id: altId,
//           alternative_text: response.alternative.text,
//           is_correct: response.alternative.is_correct,
//           response_count: 0,
//         };
//       }
//       acc[altId].response_count++;
//       return acc;
//     }, {} as any);

//     return {
//       question_id: questionId,
//       total_responses: totalResponses,
//       correct_responses: correctResponses,
//       incorrect_responses: totalResponses - correctResponses,
//       accuracy_percentage: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
//       average_time_seconds: averageTime,
//       alternative_stats: Object.values(alternativeStats),
//     };
//   }

//   async getCollectionStats(collectionId: string) {
//     const responses = await this.prisma.questionResponse.findMany({
//       where: { collection_id: collectionId },
//       include: {
//         alternative: {
//           select: {
//             is_correct: true,
//           },
//         },
//         question: {
//           select: {
//             id: true,
//             statement: true,
//             title: true,
//           },
//         },
//       },
//     });

//     const totalResponses = responses.length;
//     const correctResponses = responses.filter(r => r.alternative.is_correct).length;
//     const totalTime = responses.reduce((sum, r) => sum + (r.response_time || 0), 0);
//     const averageTime = totalResponses > 0 ? totalTime / totalResponses : 0;

//     // Estatísticas por questão
//     const questionStats = responses.reduce((acc, response) => {
//       const qId = response.question.id;
//       if (!acc[qId]) {
//         acc[qId] = {
//           question_id: qId,
//           question_title: response.question.title,
//           question_statement: response.question.statement,
//           total_responses: 0,
//           correct_responses: 0,
//         };
//       }
//       acc[qId].total_responses++;
//       if (response.alternative.is_correct) {
//         acc[qId].correct_responses++;
//       }
//       return acc;
//     }, {} as any);

//     return {
//       collection_id: collectionId,
//       total_responses: totalResponses,
//       correct_responses: correctResponses,
//       incorrect_responses: totalResponses - correctResponses,
//       accuracy_percentage: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
//       average_time_seconds: averageTime,
//       question_stats: Object.values(questionStats),
//     };
//   }
// }
