import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth-dto';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor( private userService: UsersService ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<{ user: any; token: string } | null> {
    const user = await this.userService.findByEmail(loginAuthDto.email);
    if (!user) {
      return null;
    }
    const bcrypt = await import('bcrypt');
    const passwordMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!passwordMatch) {
      return null;
    }

    // Define expiresIn based on remember field
    let jwtOptions: jwt.SignOptions = {};
    if (!loginAuthDto.rememberMe) {
      jwtOptions.expiresIn = '5h';
    }
    // If remember is true, do not set expiresIn (token won't expire)
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      jwtOptions
    );
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async ExistEmail(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !!user; // Return true if user exists, false otherwise
  }
}
