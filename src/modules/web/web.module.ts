import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { WebController } from './web.controller';
import { WebService } from './web.service';

@Module({
  controllers: [WebController],
  providers: [WebService],
  imports: [CustomerModule, AuthModule],
})
export class WebModule {}
