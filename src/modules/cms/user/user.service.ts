import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import type Redis from 'ioredis';
import { Model } from 'mongoose';
import { CACHE_CONSTANT } from 'src/constants/cache.constant';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { ERROR } from 'src/constants/exception.constant';
import { User } from 'src/entities/user.entity';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ApiConfigService } from 'src/shared/services/api-config.service';

import type { ShortUserInfoDto } from './dto/short-user-info.dto';

@Injectable()
export class UserService {
  private redisInstance: Redis;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
    );
  }

  async getListUser(): Promise<ShortUserInfoDto[]> {
    const cachedData = await this.redisInstance.get(
      `${CACHE_CONSTANT.SESSION_PREFIX}listUser`,
    );

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const listUser = await this.userModel.find({});

    if (listUser.length === 0) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }

    const listUserResult: ShortUserInfoDto[] = listUser.map((e) => ({
      user_id: e._id.toString(),
      email: e.email,
    }));

    await this.redisInstance.set(
      `${CACHE_CONSTANT.SESSION_PREFIX}listUser`,
      JSON.stringify(listUserResult),
    );

    return listUserResult;
  }
}
