import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './database/prisma.service';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [UsersModule, CollectionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
