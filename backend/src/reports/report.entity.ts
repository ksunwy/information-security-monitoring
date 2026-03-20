import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Asset } from '../assets/asset.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  type: 'vuln_summary' | 'asset_scan' | 'full_audit' | 'custom';

  @Column('jsonb', { nullable: true })
  data: any;

  @Column({ default: 'pending' })
  status: 'pending' | 'generated' | 'failed';

  @Column({ nullable: true })
  filePath?: string; 

  @ManyToOne(() => User, (user) => user.reports, { nullable: true })
  user: User;

  @ManyToOne(() => Asset, (asset) => asset.reports, { nullable: true })
  asset?: Asset;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}