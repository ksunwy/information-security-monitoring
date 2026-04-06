import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Asset } from '../assets/asset.entity';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, (asset) => asset.scans, {
    onDelete: 'CASCADE',
  })
  asset: Asset;

  @Column('jsonb')
  ports: any[];

  @Column({ default: 'not scanned' })
  status: string;

  @Column({ default: 'not scanned' })
  scan_result: string;

  @Column({ default: 'not scanned' })
  scan_type: string;

  @Column('jsonb', { nullable: true })
  changes: any;

  @Column('jsonb', { nullable: true })
  os: any;

  @Column('jsonb', { nullable: true })
  scripts: any;

  @CreateDateColumn()
  scannedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  zapScanId: string | null;

  @Column({ default: 0 })
  webVulnerabilitiesCount: number;

  @Column({ type: 'bigint', nullable: true })
  zapDurationMs: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  scanResultDetails: string | null;
}