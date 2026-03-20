import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  @Get()
  @ApiOperation({
    summary: 'Получить список всех пользователей',
    description: 'Доступно только администраторам. Возвращает всех пользователей без паролей.',
  })
  @ApiOkResponse({ type: [UserResponseDto], description: 'Список пользователей' })
  @ApiUnauthorizedResponse({ description: 'Необходима авторизация' })
  @ApiForbiddenResponse({ description: 'Доступ запрещён (требуется роль admin)' })
  async findAll(
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('role') role?: string,): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll({ sortBy, sortOrder, search, role });
    return users.map(u => ({
      id: u.id,
      email: u.email,
      login: u.login,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }

  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Создать нового пользователя',
    description: 'Доступно только администраторам. Создаёт пользователя с заданной ролью.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto, description: 'Пользователь создан' })
  @ApiBadRequestResponse({ description: 'Некорректные данные или email/login заняты' })
  @ApiForbiddenResponse({ description: 'Доступ запрещён (требуется роль admin)' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Get('me')
  @ApiOperation({
    summary: 'Получить информацию о текущем пользователе',
    description: 'Возвращает данные авторизованного пользователя.',
  })
  @ApiOkResponse({ type: UserResponseDto, description: 'Данные пользователя' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  async getMe(@Req() req: Request & { user: User }): Promise<UserResponseDto> {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({
    summary: 'Получить информацию о пользователе по ID',
    description: 'Доступно только администраторам.',
  })
  @ApiParam({ name: 'id', type: Number, example: 5 })
  @ApiOkResponse({ type: UserResponseDto, description: 'Данные пользователя' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiForbiddenResponse({ description: 'Доступ запрещён (требуется роль admin)' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Обновить данные пользователя',
    description: 'Доступно только администраторам.',
  })
  @ApiParam({ name: 'id', type: Number, example: 5 })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto, description: 'Пользователь обновлён' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiForbiddenResponse({ description: 'Доступ запрещён (требуется роль admin)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updated = await this.usersService.update(id, dto);
    return {
      id: updated.id,
      email: updated.email,
      login: updated.login,
      name: updated.name,
      role: updated.role,
      createdAt: updated.createdAt,
    };
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить пользователя',
    description: 'Удаляет пользователя по ID. Доступно только администраторам. Нельзя удалить самого себя.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 5,
    description: 'ID пользователя, которого нужно удалить',
  })
  @ApiOkResponse({
    description: 'Пользователь успешно удалён',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Пользователь с ID 5 успешно удалён' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
  })
  @ApiForbiddenResponse({
    description: 'Доступ запрещён (требуется роль admin)',
  })
  @ApiBadRequestResponse({
    description: 'Нельзя удалить самого себя',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ): Promise<{ message: string }> {
    await this.usersService.delete(id, req.user.id);
    return { message: `Пользователь с ID ${id} успешно удалён` };
  }
}