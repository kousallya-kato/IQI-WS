import { Controller, Get } from '@nestjs/common';
import { SocketService } from './socket.service';

@Controller('sockets')
export class SocketController {
    constructor(private readonly socketService: SocketService) { }


}
