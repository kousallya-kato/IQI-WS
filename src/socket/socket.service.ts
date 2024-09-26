import { Injectable } from '@nestjs/common';
import { WebSocketServer, WebSocket } from 'ws';
import { Session } from './session.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket[]> = new Map();

  constructor(@InjectModel(Session.name) private readonly session: Model<Session>) {
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const sessionId = this.getSessionIdFromUrl(req.url);
      this.addClientToSession(sessionId, ws);

      ws.on('message', (message) => {
        this.handleMessage(sessionId, message);
      });

      ws.on('close', () => {
        this.removeClientFromSession(sessionId, ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private getSessionIdFromUrl(url: string | undefined): string | null {
    if (!url) return null;
    const match = url.match(/\/ws\/session\/([^/]+)/);
    return match ? match[1] : null;
  }

  private addClientToSession(sessionId: string | null, client: WebSocket) {
    if (!sessionId) return;

    if (!this.clients.has(sessionId)) {
      this.clients.set(sessionId, []);
    }

    this.clients.get(sessionId)?.push(client);
    console.log(`Client added to session ${sessionId}. Total clients: ${this.clients.get(sessionId)?.length}`);
  }

  private removeClientFromSession(sessionId: string | null, client: WebSocket) {
    if (!sessionId) return;

    const sessionClients = this.clients.get(sessionId);
    if (sessionClients) {
      this.clients.set(sessionId, sessionClients.filter((c) => c !== client));
      console.log(`Client removed from session ${sessionId}. Remaining clients: ${this.clients.get(sessionId)?.length}`);
    }
  }

  private handleMessage(sessionId: string | null, message: WebSocket.Data) {
    if (!sessionId) return;
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log(`Message received from session ${sessionId}:`, parsedMessage);
      
      this.broadcastMessage(sessionId, parsedMessage?.payload); 
      this.updateSessionWithMessage(sessionId, parsedMessage?.payload);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private broadcastMessage(sessionId: string | null, message: any) {
    const sessionClients = this.clients.get(sessionId);
    if (sessionClients) {
      sessionClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  private async updateSessionWithMessage(sessionId: string | null, message: any) {
    if (!sessionId) return;

    try {
      await this.session.updateOne(
        { _id: sessionId },
        { $push: { messages: message } }
      );
      console.log(`Session ${sessionId} updated with new message.`);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  public getWebSocketServer(): WebSocketServer {
    return this.wss;
  }
}
