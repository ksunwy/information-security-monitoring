import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: {
    email: string;
    login: string;
    name: string;
    password: string;
  }) {
    const existsByEmail = await this.usersService.findByEmail(dto.email);
    const existsByLogin = await this.usersService.findByLogin(dto.login);

    if (existsByEmail || existsByLogin) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      login: dto.login,
      name: dto.name,
      password: passwordHash,
      role: 'observer',
    });

    return this.buildResponse(user);
  }

  async login(user: User) {
    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        login: user.login,
        name: user.name,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async logout() {
    return {
      message: 'Вы успешно вышли из системы',
    };
  }
}
