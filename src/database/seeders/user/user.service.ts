import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { COMMON_CONSTANT } from 'src/constants/common.constant';
import { User } from 'src/entities/user.entity';

import { usersSeedData } from './data';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserSeederService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(): Array<Promise<User>> {
    return usersSeedData.map(async (user: CreateUserDto) => {
      try {
        const checkExistUser = await this.userModel.findOne({
          username: user.username,
        });

        if (checkExistUser != null) {
          return Promise.resolve(null);
        }

        const hashPassword = await hash(
          user.password,
          COMMON_CONSTANT.BCRYPT_SALT_ROUND,
        );
        user.password = hashPassword;

        return Promise.resolve(await this.userModel.create(user));
      } catch (error: unknown) {
        return Promise.reject(error);
      }
    });
  }
}
