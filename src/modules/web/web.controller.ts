import { Controller } from '@nestjs/common';

import { WebService } from './web.service';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}
}
