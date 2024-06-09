import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/constants/role.constant';
import { Roles } from 'src/shared/decorators/auth.decorator';

import type { ShortUserInfoDto } from './dto/short-user-info.dto';
import { UserService } from './user.service';

@Controller('cms/user')
@ApiTags('Auth')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list-user')
  @Roles([Role.Admin])
  async listUser(): Promise<ShortUserInfoDto[]> {
    const listUserResult = await this.userService.getListUser();

    return listUserResult;
  }
}
