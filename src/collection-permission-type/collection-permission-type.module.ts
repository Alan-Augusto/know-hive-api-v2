import { Module } from '@nestjs/common';
import { CollectionPermissionTypeService } from './collection-permission-type.service';
import { CollectionPermissionTypeController } from './collection-permission-type.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CollectionPermissionTypeController],
  providers: [CollectionPermissionTypeService, PrismaService],
})
export class CollectionPermissionTypeModule {}
