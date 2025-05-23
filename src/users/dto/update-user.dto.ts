import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
        @ApiProperty({ example: 'João Silva' })
        name: string;
        @ApiProperty({ example: 'https://flowbite.com/docs/images/examples/image-1@2x.jpg' })
        profile_picture: string;
}
