import { Controller, Logger } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('api/room')
export class RoomController {
  constructor(
    private readonly service: RoomService,
  ) {}

  private readonly logger = new Logger(RoomController.name);

  // Log function
  Logger(functionName: string, input: any = null) {
    this.logger.log(`Function: ${functionName} | input:`, input);
  }
}
