import { Injectable } from '@nestjs/common';
import { CreateCollectionPermissionTypeDto } from './dto/create-collection-permission-type.dto';
import { UpdateCollectionPermissionTypeDto } from './dto/update-collection-permission-type.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CollectionPermissionTypeService {

  constructor( private prisma: PrismaService){}

  create(createCollectionPermissionTypeDto: CreateCollectionPermissionTypeDto) {
    return this.prisma.collectionPermissionType.create({data:createCollectionPermissionTypeDto});;
  }

  findAll() {
    return this.prisma.collectionPermissionType.findMany();
  }

  findOne(id: number) {
    return this.prisma.collectionPermissionType.findUnique({
      where: {
        id
      }
    });
  }

  update(id: number, updateCollectionPermissionTypeDto: UpdateCollectionPermissionTypeDto) {
    return this.prisma.collectionPermissionType.update({
      where: {
        id
      },
      data: updateCollectionPermissionTypeDto
    });
  }

  remove(id: number) {
    return this.prisma.collectionPermissionType.delete({
      where: {
        id
      }
    });
  }
}
