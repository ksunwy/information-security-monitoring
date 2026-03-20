import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({ description: 'Пользователь успешно зарегистрирован' })
  @ApiBadRequestResponse({ description: 'Пользователь уже существует или неверные данные' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiUnauthorizedResponse({ description: 'Неверный логин или пароль' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Выход пользователя из системы' })
  logout() {
    return this.authService.logout();
  }
}
