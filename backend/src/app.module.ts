import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { ScansModule } from './scans/scans.module';
import { VulnerabilitiesModule } from './vulnerabilities/vulnerabilities.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { LogsModule } from './systemLogs/logs.module';
import { CveModule } from './cve/cve.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '123',
      database: 'security_monitoring',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 86400,
      max: 1000,
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    AssetsModule,
    ScansModule,
    VulnerabilitiesModule,
    ReportsModule,
    DashboardsModule,
    LogsModule,
    CveModule,
    AnalyticsModule,
  ],
})
export class AppModule { }