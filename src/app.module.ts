import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.dbUrl),
    SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
