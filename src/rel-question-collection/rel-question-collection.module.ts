import { Module } from '@nestjs/common';
import { RelQuestionCollectionService } from './rel-question-collection.service';
import { RelQuestionCollectionController } from './rel-question-collection.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [RelQuestionCollectionController],
  providers: [RelQuestionCollectionService, PrismaService],
})
export class RelQuestionCollectionModule {}
