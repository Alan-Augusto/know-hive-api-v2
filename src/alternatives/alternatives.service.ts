import { Injectable } from '@nestjs/common';
import { CreateAlternativeDto } from './dto/create-alternative.dto';
import { UpdateAlternativeDto } from './dto/update-alternative.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AlternativesService {

  constructor( private prisma: PrismaService){}

  create(createAlternativeDto: CreateAlternativeDto) {
    return this.prisma.alternative.create({data:createAlternativeDto});
  }

  findAll() {
    return this.prisma.alternative.findMany({
      include: {
        question: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.alternative.findUnique({
      where: {
        id
      },
    });
  }

  update(id: string, updateAlternativeDto: UpdateAlternativeDto) {
    return this.prisma.alternative.update({
      where: {
        id
      },
      data: updateAlternativeDto
    });
  }

  remove(id: string) {
    return this.prisma.alternative.delete({
      where: {
        id
      }
    });
  }
}
