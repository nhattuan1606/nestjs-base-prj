import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { COMMON_CONSTANT } from './constants/common.constant';
import { CmsModule } from './modules/cms/cms.module';
import { CronModule } from './modules/cron/cron.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { WebModule } from './modules/web/web.module';
import { HttpExceptionFilter } from './shared/filters/exception.filter';
import { JwtAuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler.guard';
import { ResponseTransformInterceptor } from './shared/interceptors/response.interceptor';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      ttl: COMMON_CONSTANT.THROTTLER.TTL,
      limit: COMMON_CONSTANT.THROTTLER.LIMIT,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        config: configService.getRedisConfig(),
      }),
    }),
    SharedModule,
    HealthCheckModule,
    CronModule,
    CmsModule,
    WebModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
