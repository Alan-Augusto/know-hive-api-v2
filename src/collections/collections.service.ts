import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CollectionsService {

  constructor( private prisma: PrismaService){}

  create(createCollectionDto: CreateCollectionDto) {
    return this.prisma.collection.create({data:createCollectionDto});;
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

  findOne(id: string) {
    return this.prisma.collection.findUnique({
      where: {
        id
      }
    });
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
