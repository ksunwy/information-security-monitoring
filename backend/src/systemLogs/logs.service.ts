import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogsService {
  constructor(@InjectRepository(Log) private repo: Repository<Log>) {}

  async create(dto: { type: 'user_activity' | 'scan_result' | 'scan_start' | 'scan'; message: string; userId?: number }): Promise<Log> {
    return this.repo.save(dto);
  }

  async findAll(type?: 'user_activity' | 'scan_result' | 'scan_start' | 'scan'): Promise<Log[]> {
    return this.repo.find({ where: type ? { type } : undefined, relations: ['user'], order: { timestamp: 'DESC' } });
  }
}