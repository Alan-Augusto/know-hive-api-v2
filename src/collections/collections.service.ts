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
