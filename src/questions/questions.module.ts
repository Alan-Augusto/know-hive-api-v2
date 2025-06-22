import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaService } from 'src/database/prisma.service';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService],
})
export class QuestionsModule {}
