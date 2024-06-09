import type { RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { isNil } from 'lodash';
import { COMMON_CONSTANT } from 'src/constants/common.constant';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  getEnv(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(`${key} not set in env yet`);
    }

    return value;
  }

  getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.getEnv('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: Number(this.getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
      },
    };
  }

  getRedisConfig(): RedisClientOptions[] {
    return [
      {
        namespace: COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
        connectionName: COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
        url: `redis://${this.getEnv('REDIS_HOST')}:${this.getEnv(
          'REDIS_PORT',
        )}/0`,
      },
    ];
  }
}
