import { Controller } from '@nestjs/common';

import { CustomerService } from './customer.service';

@Controller('cms/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
}
