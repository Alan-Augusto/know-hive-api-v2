import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { PrismaService } from 'src/database/prisma.service';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, PrismaService],
})
export class CollectionsModule {}
