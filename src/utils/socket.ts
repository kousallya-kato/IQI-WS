import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';

@Injectable()
export class WebSocketService implements OnModuleInit {
  private wss: WebSocketServer;

  // Initialize WebSocketServer on module startup
  onModuleInit() {
    this.wss = new WebSocketServer({ noServer: true });

    if (!this.wss) {
      throw new Error('WebSocket server initialization failed');
    }
  }

  // Expose the WebSocket server for external use
  public getWebSocketServer(): WebSocketServer {
    if (!this.wss) {
      throw new Error('WebSocket server is not initialized');
    }
    return this.wss;
  }
}