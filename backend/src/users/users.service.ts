import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

interface FindAllParams {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  role?: string;
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

   async findAll(params: FindAllParams = {}): Promise<User[]> {
    const { sortBy = 'id', sortOrder = 'ASC', search, role } = params;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (search) {
      queryBuilder.where(
        '(user.name LIKE :search OR user.email LIKE :search OR user.login LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    if (role) {
      if (search) {
        queryBuilder.andWhere('user.role = :role', { role });
      } else {
        queryBuilder.where('user.role = :role', { role });
      }
    }
    
    const allowedSortFields = ['id', 'name', 'email', 'login', 'role', 'createdAt'];
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('user.id', 'ASC');
    }
    
    return queryBuilder.getMany();
  }

  async update(id: number, dto: Partial<User>): Promise<User> {
    return this.userRepository.save({ id, ...dto });
  }

  async delete(id: number, currentUserId: number): Promise<void> {
    if (id === currentUserId) {
      throw new BadRequestException('Нельзя удалить самого себя');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    await this.userRepository.remove(user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}