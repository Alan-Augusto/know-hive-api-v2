import { Module } from '@nestjs/common';
import { QuestionResponseService } from './question-response.service';
import { QuestionResponseController } from './question-response.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionResponseController],
  providers: [QuestionResponseService],
  exports: [QuestionResponseService],
})
export class QuestionResponseModule {}
