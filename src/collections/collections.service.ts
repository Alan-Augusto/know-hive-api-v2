import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionWithQuestionsDto } from './dto/create-collection-with-questions.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CollectionsService {

  constructor( private prisma: PrismaService){}

  create(createCollectionDto: CreateCollectionDto) {
    return this.prisma.collection.create({data:createCollectionDto});;
  }
  async createOrUpdateWithQuestions(createCollectionWithQuestionsDto: CreateCollectionWithQuestionsDto) {
    const { id, questions_ids, ...collectionData } = createCollectionWithQuestionsDto;

    // Create or update collection and connect questions in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      let collection;

      if (id) {
        // Delete existing question connections if updating
        await prisma.questionCollection.deleteMany({
          where: { collection_id: id }
        });

        // Update existing collection
        collection = await prisma.collection.update({
          where: { id },
          data: collectionData
        });
      } else {
        // Create new collection
        collection = await prisma.collection.create({
          data: collectionData
        });
      }

      // Connect the questions to the collection
      if (questions_ids && questions_ids.length > 0) {
        await Promise.all(
          questions_ids.map(questionId =>
            prisma.questionCollection.create({
              data: {
                collection_id: collection.id,
                question_id: questionId
              }
            })
          )
        );
      }

      // Return the created/updated collection with questions
      return await prisma.collection.findUnique({
        where: { id: collection.id },
        include: {
          questions: {
            include: {
              question: {
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
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              profile_picture: true
            }
          }
        }
      });
    });

    return result;
  }

  findAll() {
    return this.prisma.collection.findMany();
  }

  findByUser(userId: string) {
    return this.prisma.collection.findMany({
      where: {
        OR: [
          // Coleções criadas pelo usuário
          {
            author_id: userId
          },
          // Coleções compartilhadas com o usuário
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
        questions: {
          include: {
            question: {
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
            }
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const questions = await this.prisma.questionCollection.findMany({
      where: { collection_id: id },
      select: { question_id: true }
    });

    const collection = await this.prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) return null;

    return {
      ...collection,
      questions_ids: questions.map(q => q.question_id)
    };
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prisma.collection.update({
      where: {
        id
      },
      data: updateCollectionDto
    });
  }

  remove(id: string) {
    return this.prisma.collection.delete({
      where: {
        id
      }
    });
  }
}
