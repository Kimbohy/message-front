import { io, Socket } from "socket.io-client";
import { apiService } from "./api";
import { SOCKET_EVENTS } from "../constants";
import type {
  Chat,
  SocketMessage,
  ChatUpdateEvent,
  ChatJoinedEvent,
  ChatLeftEvent,
  SocketErrorEvent,
  SocketEventHandlers,
  StartChatByEmailPayload,
} from "../types";

/**
 * SocketService
 * Manages WebSocket connection and event handling
 * Provides clean interface for chat real-time operations
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Get WebSocket server URL
   */
  private getSocketUrl(): string {
    if (typeof window !== "undefined") {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:3002`;
    }
    return "http://localhost:3002";
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = apiService.getToken();

      if (!token) {
        reject(new Error("No authentication token available"));
        return;
      }

      this.socket = io(this.getSocketUrl(), {
        auth: { token },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.setupConnectionHandlers(resolve, reject);
    });
  }

  /**
   * Setup connection event handlers
   */
  private setupConnectionHandlers(
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      resolve();
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
      this.isConnected = false;
      this.handleReconnect();
      reject(error);
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
      this.isConnected = false;
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error: SocketErrorEvent) => {
      console.error("⚠️  WebSocket error:", error);
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
    } else {
      console.error("❌ Max reconnection attempts reached");
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("👋 Disconnected from WebSocket");
    }
  }

  /**
   * Check if socket is connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // ==================== Event Listeners ====================

  /**
   * Register event handlers
   */
  on(handlers: SocketEventHandlers): void {
    if (!this.socket) return;

    if (handlers.onMessage) {
      this.socket.on(SOCKET_EVENTS.MESSAGE, handlers.onMessage);
    }
    if (handlers.onChatUpdated) {
      this.socket.on(SOCKET_EVENTS.CHAT_UPDATED, handlers.onChatUpdated);
    }
    if (handlers.onChatCreated) {
      this.socket.on(SOCKET_EVENTS.CHAT_CREATED, handlers.onChatCreated);
    }
    if (handlers.onChatListInitial) {
      this.socket.on(
        SOCKET_EVENTS.CHAT_LIST_INITIAL,
        handlers.onChatListInitial
      );
    }
    if (handlers.onChatJoined) {
      this.socket.on(SOCKET_EVENTS.CHAT_JOINED, handlers.onChatJoined);
    }
    if (handlers.onChatLeft) {
      this.socket.on(SOCKET_EVENTS.CHAT_LEFT, handlers.onChatLeft);
    }
    if (handlers.onError) {
      this.socket.on(SOCKET_EVENTS.ERROR, handlers.onError);
    }
  }

  /**
   * Convenience methods for individual event listeners
   */
  onMessage(handler: (message: SocketMessage) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.MESSAGE, handler);
    }
  }

  onChatUpdated(handler: (update: ChatUpdateEvent) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.CHAT_UPDATED, handler);
    }
  }

  onChatCreated(handler: (chat: Chat) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.CHAT_CREATED, handler);
    }
  }

  onChatListInitial(handler: (chats: Chat[]) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.CHAT_LIST_INITIAL, handler);
    }
  }

  onChatJoined(handler: (event: ChatJoinedEvent) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.CHAT_JOINED, handler);
    }
  }

  onChatLeft(handler: (event: ChatLeftEvent) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.CHAT_LEFT, handler);
    }
  }

  onError(handler: (error: SocketErrorEvent) => void): void {
    if (this.socket) {
      this.socket.on(SOCKET_EVENTS.ERROR, handler);
    }
  }

  /**
   * Remove event handlers
   */
  off(handlers: SocketEventHandlers): void {
    if (!this.socket) return;

    if (handlers.onMessage) {
      this.socket.off(SOCKET_EVENTS.MESSAGE, handlers.onMessage);
    }
    if (handlers.onChatUpdated) {
      this.socket.off(SOCKET_EVENTS.CHAT_UPDATED, handlers.onChatUpdated);
    }
    if (handlers.onChatCreated) {
      this.socket.off(SOCKET_EVENTS.CHAT_CREATED, handlers.onChatCreated);
    }
    if (handlers.onChatListInitial) {
      this.socket.off(
        SOCKET_EVENTS.CHAT_LIST_INITIAL,
        handlers.onChatListInitial
      );
    }
    if (handlers.onChatJoined) {
      this.socket.off(SOCKET_EVENTS.CHAT_JOINED, handlers.onChatJoined);
    }
    if (handlers.onChatLeft) {
      this.socket.off(SOCKET_EVENTS.CHAT_LEFT, handlers.onChatLeft);
    }
    if (handlers.onError) {
      this.socket.off(SOCKET_EVENTS.ERROR, handlers.onError);
    }
  }

  // ==================== Emit Events ====================

  /**
   * Request chat list from server
   */
  getChatList(): void {
    this.emit(SOCKET_EVENTS.GET_CHAT_LIST);
  }

  /**
   * Join a chat room
   */
  joinChat(chatId: string): void {
    this.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId });
  }

  /**
   * Leave a chat room
   */
  leaveChat(chatId: string): void {
    this.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId });
  }

  /**
   * Send a message to a chat
   */
  sendMessage(chatId: string, content: string): void {
    this.emit(SOCKET_EVENTS.SEND_MESSAGE, { chatId, content });
  }

  /**
   * Start a chat by recipient email
   */
  startChatByEmail(payload: StartChatByEmailPayload): void {
    this.emit(SOCKET_EVENTS.START_CHAT_BY_EMAIL, payload);
  }

  /**
   * Generic emit helper
   */
  private emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️  Cannot emit ${event}: Socket not connected`);
    }
  }
}

export const socketService = new SocketService();
