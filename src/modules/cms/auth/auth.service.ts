import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import type { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { CACHE_CONSTANT } from 'src/constants/cache.constant';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { ERROR } from 'src/constants/exception.constant';
import { Role } from 'src/constants/role.constant';
import { User } from 'src/entities/user.entity';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ApiConfigService } from 'src/shared/services/api-config.service';

import type { JwtPayload } from '../../../shared/dto/jwt-payload.dto';
import type { LoginRequestDto } from './dto/login-request.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { RegisterRequestDto } from './dto/register-request.dto';
import type { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
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

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.apiConfigService.getEnv(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
      secret: this.apiConfigService.getEnv('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userModel.findOne({
      email: loginRequestDto.email,
    });

    if (!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }

    const match = await compare(loginRequestDto.password, user.password);

    if (!match) {
      throw new BaseException(ERROR.WRONG_USERNAME_OR_PASSWORD);
    }

    const accessToken = this.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: Role.Admin,
    });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: Role.Admin,
    });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${user._id.toString()}`,
      signatureAccessToken,
      signatureRefreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const checkUserExist = await this.userModel.findOne({
      email: registerRequestDto.email,
    });

    if (checkUserExist) {
      throw new BaseException(ERROR.USER_EXISTED);
    }

    const hashPassword = await hash(
      registerRequestDto.password,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND,
    );
    const userCreated = await this.userModel.create({
      email: registerRequestDto.email,
      password: hashPassword,
    });

    return {
      id: userCreated._id.toString(),
      email: userCreated.email,
    };
  }

  async logout(accessToken: string, userId: string): Promise<boolean> {
    const signature = accessToken.split('.')[2];
    const logoutResult = await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`,
      signature,
    );

    return Boolean(logoutResult);
  }

  async revokeUser(userId: string): Promise<boolean> {
    const revokeResult = await this.redisInstance.del(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`,
    );

    return Boolean(revokeResult);
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<LoginResponseDto> {
    const signatureAccessToken = accessToken.split('.')[2];
    const signatureRefreshToken = refreshToken.split('.')[2];

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.apiConfigService.getEnv('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        payload = this.jwtService.decode(refreshToken) as JwtPayload;
        await this.redisInstance.hdel(
          `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
          signatureAccessToken,
        );

        throw new BaseException(ERROR.REFRESH_TOKEN_EXPIRED);
      } else {
        throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
      }
    }

    const signatureRefreshTokenCache = await this.redisInstance.hget(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken,
    );

    if (
      !signatureRefreshTokenCache ||
      signatureRefreshTokenCache !== signatureRefreshToken
    ) {
      throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
    }

    const newAccessToken = this.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const newSignatureAccessToken = newAccessToken.split('.')[2];
    const newSignatureRefreshToken = newRefreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      newSignatureAccessToken,
      newSignatureRefreshToken,
    );

    await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
