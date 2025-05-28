import { Module } from '@nestjs/common';
import { QuestionTypesService } from './question-types.service';
import { QuestionTypesController } from './question-types.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [QuestionTypesController],
  providers: [QuestionTypesService, PrismaService],
})
export class QuestionTypesModule {}
