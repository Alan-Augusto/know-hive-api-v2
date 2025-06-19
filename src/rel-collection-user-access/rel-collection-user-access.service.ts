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

  findAllByCollection(collectionId: string) {
    return this.prisma.collectionUserAccess.findMany({
      where: { collection_id: collectionId.toString() },
      include: {
        user: true,
        collection: true,
        permission_type: true,
      },
    });
  }

  async grantAccess(giverUserId: string, collectionId: string, receiverEmail: string, accessTypeId: number) {
    console.log('Granting access:', {
      collectionId,
      receiverEmail,
      accessTypeId,
    });
    const receiver = await this.prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      throw new Error('Receiver user not found');
    }

    return this.prisma.collectionUserAccess.create({
      data: {
        user_id: receiver.id,
        collection_id: collectionId,
        permission_type_id: accessTypeId,
      },
    });
  }
}
