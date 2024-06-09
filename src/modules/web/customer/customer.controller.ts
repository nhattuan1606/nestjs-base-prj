import { Controller } from '@nestjs/common';

import { CustomerService } from './customer.service';

@Controller('web/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
}
