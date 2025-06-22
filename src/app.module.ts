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
import { CollectionPermissionTypeModule } from './collection-permission-type/collection-permission-type.module';
import { RelCollectionUserAccessModule } from './rel-collection-user-access/rel-collection-user-access.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { RelQuestionUserAccessModule } from './rel-question-user-access/rel-question-user-access.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [UsersModule, CollectionsModule, QuestionsModule, QuestionTypesModule, AlternativesModule, RelQuestionCollectionModule, CollectionPermissionTypeModule, RelCollectionUserAccessModule, AuthModule, MediaModule, RelQuestionUserAccessModule, TagsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
