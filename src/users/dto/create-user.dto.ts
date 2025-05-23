import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'joao@example.com' })
    @IsEmail()
    email: string;
    @ApiProperty({ example: '123456' })
    @IsStrongPassword()
    password: string;
    @ApiProperty({ example: 'João Silva' })
    name: string;
    @ApiProperty({ example: 'https://flowbite.com/docs/images/examples/image-1@2x.jpg' })
    profile_picture: string;
}
