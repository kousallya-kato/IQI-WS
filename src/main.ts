import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createServer } from 'http';
import { SocketService } from './socket/socket.service'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const server = createServer(app.getHttpAdapter().getInstance());
  const websocketService = app.get(SocketService);

  // Upgrade HTTP connection to WebSocket
  server.on('upgrade', (request, socket, head) => {
    websocketService.getWebSocketServer().handleUpgrade(request, socket, head, (ws) => {
      websocketService.getWebSocketServer().emit('connection', ws, request);
    });
  });

  await server.listen(2002);
}

bootstrap();
