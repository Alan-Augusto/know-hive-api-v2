import { Module } from '@nestjs/common';
import { RelCollectionUserAccessService } from './rel-collection-user-access.service';
import { RelCollectionUserAccessController } from './rel-collection-user-access.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [RelCollectionUserAccessController],
  providers: [RelCollectionUserAccessService, PrismaService],
})
export class RelCollectionUserAccessModule {}
