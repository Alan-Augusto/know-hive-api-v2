import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './database/prisma.service';
import { CollectionsModule } from './collections/collections.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionTypesModule } from './question-types/question-types.module';
import { AlternativesModule } from './alternatives/alternatives.module';
import { RelQuestionCollectionModule } from './rel-question-collection/rel-question-collection.module';

@Module({
  imports: [UsersModule, CollectionsModule, QuestionsModule, QuestionTypesModule, AlternativesModule, RelQuestionCollectionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
