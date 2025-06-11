import { Module } from '@nestjs/common';
import { RelQuestionUserAccessService } from './rel-question-user-access.service';
import { RelQuestionUserAccessController } from './rel-question-user-access.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [RelQuestionUserAccessController],
  providers: [RelQuestionUserAccessService, PrismaService],
})
export class RelQuestionUserAccessModule {}
