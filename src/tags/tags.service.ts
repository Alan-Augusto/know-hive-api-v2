import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagWithCounts } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      return await this.prisma.tag.create({
        data: createTagDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Uma tag com este nome já existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<TagWithCounts[]> {
    return await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            collections: true,
            questions: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<TagWithCounts> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            collections: true,
            questions: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }

    return tag;
  }

  async findByName(name: string): Promise<Tag[]> {
    return await this.prisma.tag.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      return await this.prisma.tag.update({
        where: { id },
        data: updateTagDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Tag não encontrada');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Uma tag com este nome já existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.tag.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Tag não encontrada');
      }
      throw error;
    }
  }

  // Métodos para gerenciar tags em coleções
  async assignTagsToCollection(collectionId: string, tagIds: string[]): Promise<void> {
    // Remove todas as tags existentes da coleção
    await this.prisma.collectionTag.deleteMany({
      where: { collection_id: collectionId },
    });

    // Adiciona as novas tags
    if (tagIds.length > 0) {
      await this.prisma.collectionTag.createMany({
        data: tagIds.map(tagId => ({
          collection_id: collectionId,
          tag_id: tagId,
        })),
      });
    }
  }

  async getCollectionTags(collectionId: string): Promise<Tag[]> {
    const collectionTags = await this.prisma.collectionTag.findMany({
      where: { collection_id: collectionId },
      include: {
        tag: true,
      },
      orderBy: {
        tag: {
          name: 'asc',
        },
      },
    });

    return collectionTags.map(ct => ct.tag);
  }

  async removeTagFromCollection(collectionId: string, tagId: string): Promise<void> {
    await this.prisma.collectionTag.deleteMany({
      where: {
        collection_id: collectionId,
        tag_id: tagId,
      },
    });
  }

  // Métodos para gerenciar tags em questões
  async assignTagsToQuestion(questionId: string, tagIds: string[]): Promise<void> {
    // Remove todas as tags existentes da questão
    await this.prisma.questionTag.deleteMany({
      where: { question_id: questionId },
    });

    // Adiciona as novas tags
    if (tagIds.length > 0) {
      await this.prisma.questionTag.createMany({
        data: tagIds.map(tagId => ({
          question_id: questionId,
          tag_id: tagId,
        })),
      });
    }
  }

  async getQuestionTags(questionId: string): Promise<Tag[]> {
    const questionTags = await this.prisma.questionTag.findMany({
      where: { question_id: questionId },
      include: {
        tag: true,
      },
      orderBy: {
        tag: {
          name: 'asc',
        },
      },
    });

    return questionTags.map(qt => qt.tag);
  }

  async removeTagFromQuestion(questionId: string, tagId: string): Promise<void> {
    await this.prisma.questionTag.deleteMany({
      where: {
        question_id: questionId,
        tag_id: tagId,
      },
    });
  }

  // Métodos para buscar coleções e questões por tags
  async getCollectionsByTag(tagId: string) {
    const collectionTags = await this.prisma.collectionTag.findMany({
      where: { tag_id: tagId },
      include: {
        collection: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                questions: true,
                likes: true,
              },
            },
          },
        },
      },
      orderBy: {
        collection: {
          created_at: 'desc',
        },
      },
    });

    return collectionTags.map(ct => ct.collection);
  }

  async getQuestionsByTag(tagId: string) {
    const questionTags = await this.prisma.questionTag.findMany({
      where: { tag_id: tagId },
      include: {
        question: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            type: true,
            _count: {
              select: {
                alternatives: true,
                likes: true,
              },
            },
          },
        },
      },
      orderBy: {
        question: {
          created_at: 'desc',
        },
      },
    });

    return questionTags.map(qt => qt.question);
  }

  normalizeTagName(name: string): string {
    return name
    .trim()
    .toLowerCase()
    // Remove acentos
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Substitui espaços e caracteres inválidos por hífen
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const tagName of tagNames) {
      const normalizedTagName = this.normalizeTagName(tagName);
      
      if (!normalizedTagName) continue;
      
      // Tentar encontrar a tag existente
      let tag = await this.prisma.tag.findFirst({
        where: {
          name: {
            equals: normalizedTagName,
            mode: 'insensitive',
          },
        },
      });
      
      // Se não encontrar, criar uma nova
      if (!tag) {
        try {
          tag = await this.prisma.tag.create({
            data: {
              name: normalizedTagName,
            },
          });
        } catch (error) {
          // Se houver erro de conflito (tag criada simultaneamente), tentar buscar novamente
          if (error.code === 'P2002') {
            tag = await this.prisma.tag.findFirst({
              where: {
                name: {
                  equals: normalizedTagName,
                  mode: 'insensitive',
                },
              },
            });
          }
          
          if (!tag) {
            throw error;
          }
        }
      }
      
      tags.push(tag);
    }
    
    return tags;
  }

  async assignTagsToCollectionByNames(collectionId: string, tagNames: string[]): Promise<void> {
    if (!tagNames || tagNames.length === 0) {
      // Se não há tags para atribuir, remove todas as tags existentes
      await this.prisma.collectionTag.deleteMany({
        where: { collection_id: collectionId },
      });
      return;
    }

    // Encontra ou cria as tags
    const tags = await this.findOrCreateTags(tagNames);
    const tagIds = tags.map(tag => tag.id);
    
    // Atribui as tags à coleção
    await this.assignTagsToCollection(collectionId, tagIds);
  }
}
