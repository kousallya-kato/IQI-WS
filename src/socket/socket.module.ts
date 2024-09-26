import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './session.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SocketController],
  providers: [SocketService],
})
export class SocketModule {}
