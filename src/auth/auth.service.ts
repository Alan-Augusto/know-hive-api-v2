import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth-dto';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';
import { RegisterAuthDto } from './dto/register-auth-dto';

@Injectable()
export class AuthService {

  constructor(private userService: UsersService) {}

  private generateToken(user: any, rememberMe?: boolean): string {
    const jwtOptions: jwt.SignOptions = {};
    if (!rememberMe) {
      jwtOptions.expiresIn = '5h';
    }
    return jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      jwtOptions
    );
  }

  private sanitizeUser(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{ user: any; token: string } | null> {
    const user = await this.userService.findByEmail(loginAuthDto.email);
    if (!user) return null;

    const bcrypt = await import('bcrypt');
    const passwordMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!passwordMatch) return null;

    const token = this.generateToken(user, loginAuthDto.rememberMe);
    return { user: this.sanitizeUser(user), token };
  }

  async ExistEmail(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<{ user: any; token: string } | null> {
    const user = await this.userService.create(registerAuthDto);
    if (!user) return null;

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }
}
