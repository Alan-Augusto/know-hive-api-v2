import { ApiProperty } from "@nestjs/swagger";

export class LoginAuthDto {
    @ApiProperty({example: 'joaodasilva@email.com'})
    email: string;
    @ApiProperty({example: '123456'})
    password: string;
    @ApiProperty({example: true, required: false})
    rememberMe?: boolean; // Optional field for "Remember Me" functionality
}