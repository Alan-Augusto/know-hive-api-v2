import { Module } from '@nestjs/common';
import { AlternativesService } from './alternatives.service';
import { AlternativesController } from './alternatives.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [AlternativesController],
  providers: [AlternativesService, PrismaService],
})
export class AlternativesModule {}
