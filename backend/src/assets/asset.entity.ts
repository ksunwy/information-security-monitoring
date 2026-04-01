import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Scan } from '../scans/scan.entity';
import { Vulnerability } from '../vulnerabilities/vulnerability.entity';
import { Report } from '../reports/report.entity';
import { User } from 'src/users/user.entity';
import { JoinColumn } from 'typeorm';

@Entity('assets')
@Unique(['ip', 'userId'])
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  name: string;

  @Column({ default: 'none' })
  criticality: string;

  @Column({ default: 'offline' })
  status: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Scan, (scan) => scan.asset)
  scans: Scan[];

  @OneToMany(() => Vulnerability, (vuln) => vuln.asset)
  vulnerabilities: Vulnerability[];

  @OneToMany(() => Report, (report) => report.asset)
  reports: Report[];

  @Index()
  @ManyToOne(() => User, (user) => user.assets, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}