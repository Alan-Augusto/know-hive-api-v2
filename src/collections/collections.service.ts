import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionWithQuestionsDto } from './dto/create-collection-with-questions.dto';
import { LikeCollectionDto } from './dto/like-collection.dto';
import { SearchCollectionsDto } from './dto/search-collections.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class CollectionsService {

  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService
  ) { }

  create(createCollectionDto: CreateCollectionDto) {
    return this.prisma.collection.create({ data: createCollectionDto });;
  } 
  
  async createOrUpdateWithQuestions(createCollectionWithQuestionsDto: CreateCollectionWithQuestionsDto) {
    const { id, questions_ids, tags, ...collectionData } = createCollectionWithQuestionsDto;

    // Create or update collection and connect questions in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      let collection;

      if (id) {
        // Delete existing question connections if updating
        await prisma.questionCollection.deleteMany({
          where: { collection_id: id }
        });        // Update existing collection (exclude author_id and any extra fields from update data)
        const { author_id, is_liked, ...updateData } = collectionData as any;
        collection = await prisma.collection.update({
          where: { id },
          data: updateData
        });
      } else {
        // Create new collection (exclude is_liked field that doesn't exist in the model)
        const { is_liked, ...validCollectionData } = collectionData as any;
        collection = await prisma.collection.create({
          data: validCollectionData
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

      return collection;
    });

    // Gerenciar tags após a transação principal
    if (tags !== undefined) {
      await this.tagsService.assignTagsToCollectionByNames(result.id, tags);
    }

    // Return the created/updated collection with questions and tags
    return await this.prisma.collection.findUnique({
      where: { id: result.id },
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
    return this.prisma.collection.findMany();
  }

  async findAllForUser(userId: string) {
    const collections = await this.prisma.collection.findMany({
      where: {
        is_public: true
      },
      include: {
        author: {
          select: {
            name: true,
            profile_picture: true
          }
        },
        likes: {
          where: {
            user_id: userId
          }
        }
      }
    });

    // Add is_liked field to each collection
    return collections.map(collection => ({
      ...collection,
      is_liked: collection.likes.length > 0,
      likes: undefined // Remove likes array from response
    }));
  }

  async findLikedByUser(userId: string) {
    const collections = await this.prisma.collection.findMany({
      where: {
        likes: {
          some: {
            user_id: userId
          }
        }
      },
      include: {
        author: {
          select: {
            name: true,
            profile_picture: true
          }
        },
        likes: {
          where: {
            user_id: userId
          }
        }
      }
    });

    // Add is_liked field to each collection
    return collections.map(collection => ({
      ...collection,
      is_liked: collection.likes.length > 0,
      likes: undefined // Remove likes array from response
    }));
  }

  async findByUser(userId: string) {
    const collections = await this.prisma.collection.findMany({
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
        },
        likes: {
          where: {
            user_id: userId
          }
        }
      }
    });

    // Add is_liked field to each collection
    return collections.map(collection => ({
      ...collection,
      is_liked: collection.likes.length > 0,
      likes: undefined // Remove likes array from response
    }));
  }

  async findOne(id: string) {
    // Get question IDs for the collection
    const questions = await this.prisma.questionCollection.findMany({
      where: { collection_id: id },
      select: { question_id: true }
    });

    // Get the collection with tags and full questions
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        questions: {
          include: {
            question: {
              include: {
                type: true,
                alternatives: true,
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

    if (!collection) return null;

    return {
      ...collection,
      questions_ids: questions.map(q => q.question_id),
      tags: collection.tags.map(t => t.tag.name),
      questions: collection.questions.map(qc => qc.question)
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

  async like(likeCollectionDto: LikeCollectionDto) {
    const { user_id, collection_id } = likeCollectionDto;

    // Check if like already exists
    const existingLike = await this.prisma.collectionLike.findUnique({
      where: {
        user_id_collection_id: {
          user_id,
          collection_id
        }
      }
    });

    if (existingLike) {
      // Unlike - remove the like
      await this.prisma.collectionLike.delete({
        where: {
          user_id_collection_id: {
            user_id,
            collection_id
          }
        }
      });
      return { liked: false, message: 'Like removido com sucesso' };
    } else {
      // Like - add the like
      await this.prisma.collectionLike.create({
        data: {
          user_id,
          collection_id
        }
      });
      return { liked: true, message: 'Like adicionado com sucesso' };
    }
  }

  async searchPublicCollections(searchCollectionsDto: SearchCollectionsDto) {
    const { searchTerm, userId } = searchCollectionsDto;

    const collections = await this.prisma.collection.findMany({
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
                description: {
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
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          where: {
            user_id: userId
          }
        },
        _count: {
          select: {
            questions: true,
            likes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Add is_liked field to each collection and transform tags to array of strings
    return collections.map(collection => ({
      ...collection,
      is_liked: collection.likes.length > 0,
      likes: undefined, // Remove likes array from response
      tags: collection.tags.map(t => t.tag.name)
    }));
  }
}
