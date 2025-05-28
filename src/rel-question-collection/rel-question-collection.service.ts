import { Injectable } from '@nestjs/common';
import { CreateRelQuestionCollectionDto } from './dto/create-rel-question-collection.dto';
import { UpdateRelQuestionCollectionDto } from './dto/update-rel-question-collection.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RelQuestionCollectionService {

  constructor( private prisma: PrismaService){}

  create(createRelQuestionCollectionDto: CreateRelQuestionCollectionDto) {
    return this.prisma.questionCollection.create({data:createRelQuestionCollectionDto});
  }

  findAll() {
    return this.prisma.questionCollection.findMany();
  }

  findOne(question_id: string, collection_id: string) {
    return this.prisma.questionCollection.findUnique({
      where: {
        question_id_collection_id: {
          question_id,
          collection_id
        }
      }
    });
  }

  update(question_id: string, collection_id: string, updateRelQuestionCollectionDto: UpdateRelQuestionCollectionDto) {
    return this.prisma.questionCollection.update({
      where: {
        question_id_collection_id: {
          question_id,
          collection_id
        }
      },
      data: updateRelQuestionCollectionDto
    });
  }

  remove(question_id: string, collection_id: string) {
    return this.prisma.questionCollection.delete({
      where: {
        question_id_collection_id: {
          question_id,
          collection_id
        }
      }
    });
  }
}
