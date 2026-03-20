import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';


@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  type: 'scan' | 'user_activity' | 'scan_result' | 'scan_start';

  @Column('text')
  message: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}