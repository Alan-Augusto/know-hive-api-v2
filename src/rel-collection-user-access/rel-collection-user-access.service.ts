import { Injectable } from '@nestjs/common';
import { CreateRelCollectionUserAccessDto } from './dto/create-rel-collection-user-access.dto';
import { UpdateRelCollectionUserAccessDto } from './dto/update-rel-collection-user-access.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RelCollectionUserAccessService {

  constructor( private prisma: PrismaService){}

  create(createRelCollectionUserAccessDto: CreateRelCollectionUserAccessDto) {
    return this.prisma.collectionUserAccess.create({data:createRelCollectionUserAccessDto});
  }

  findAll() {
    return this.prisma.collectionUserAccess.findMany();
  }

  findOne(id: string) {
    return this.prisma.collectionUserAccess.findUnique({
      where: {
        id
      }
    });
  }

  update(id: string, updateRelCollectionUserAccessDto: UpdateRelCollectionUserAccessDto) {
    return this.prisma.collectionUserAccess.update({
      where: {
        id
      },
      data: updateRelCollectionUserAccessDto
    });
  }

  remove(id: string) {
    return this.prisma.collectionUserAccess.delete({
      where: {
        id
      }
    });
  }
}
