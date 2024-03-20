import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transport: ['polling'],
})
export class AppGateway {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  async handleConnection(@ConnectedSocket() client: Socket) {
    if (!client.handshake.auth?.token) {
      client.disconnect();
      return;
    }

    const userData = this.jwtService.decode(client.handshake.auth?.token, {
      json: true,
    }) as { username: string; id: string };
    client.join(userData.id);

    this.logger.log(`client socket connected: ${client.id}`);
    this.logger.log(`client socket join room: ${userData.id}`);
    // console.log("connection to socket... token = ", client.handshake.query.token);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`client disconnected ${client.id}`);
  }
}
