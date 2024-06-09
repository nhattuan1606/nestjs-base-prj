import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user.entity';

import { UserSeederService } from './user.service';

/**
 * Import and provide seeder classes for users.
 *
 * @module
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
