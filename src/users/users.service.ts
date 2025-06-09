import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor( private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const encriptedPassword = await hash(createUserDto.password, 10);
    const userRegister: CreateUserDto = { ...createUserDto, password: encriptedPassword };
    return this.prisma.user.create({ data: userRegister });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: updateUserDto
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id: id
      }
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }
}
