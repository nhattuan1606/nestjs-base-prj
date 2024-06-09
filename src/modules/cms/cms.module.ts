import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [CmsController],
  providers: [CmsService],
  imports: [CustomerModule, AuthModule, UserModule],
})
export class CmsModule {}
