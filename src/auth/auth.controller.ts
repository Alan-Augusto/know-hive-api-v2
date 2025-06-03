import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth-dto';
import { RegisterAuthDto } from './dto/register-auth-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('exist-email/:email')
  existEmail(@Param('email') email: string) {
    return this.authService.ExistEmail(email);
  }

  @Post('register')
  @ApiBody({ type: RegisterAuthDto })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }


}
