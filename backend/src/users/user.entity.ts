import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';
import { Asset } from 'src/assets/asset.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  login: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 'observer' })
  role: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Asset, (asset) => asset.user)
  assets: Asset[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
