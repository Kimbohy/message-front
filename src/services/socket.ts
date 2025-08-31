import { io, Socket } from "socket.io-client";
import { apiService } from "./api";
import type { Chat } from "./api";

export interface SocketMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderEmail: string;
  content: string;
  createdAt: string;
}

export interface ChatUpdate {
  chatId: string;
  lastMessage: {
    content: string;
    senderEmail: string;
    senderId: string;
    createdAt: string;
  };
  updatedAt: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  private getSocketUrl(): string {
    if (typeof window !== "undefined") {
      const { protocol, hostname } = window.location;
      // Use the same host as the frontend but port 3002 for WebSocket
      return `${protocol}//${hostname}:3002`;
    }
    // Fallback for SSR or other environments
    return "http://localhost:3002";
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = apiService.getToken();

      if (!token) {
        reject(new Error("No authentication token available"));
        return;
      }

      this.socket = io(this.getSocketUrl(), {
        auth: {
          token,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
        this.isConnected = true;
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        this.isConnected = false;
      });

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Chat event listeners
  onMessage(callback: (message: SocketMessage) => void) {
    this.socket?.on("message", callback);
  }

  onChatUpdated(callback: (update: ChatUpdate) => void) {
    this.socket?.on("chatUpdated", callback);
  }

  onChatCreated(callback: (chat: Chat) => void) {
    this.socket?.on("chatCreated", callback);
  }

  onChatListInitial(callback: (chats: Chat[]) => void) {
    this.socket?.on("chatListInitial", callback);
  }

  onChatJoined(callback: (data: { chatId: string }) => void) {
    this.socket?.on("chatJoined", callback);
  }

  onChatLeft(callback: (data: { chatId: string }) => void) {
    this.socket?.on("chatLeft", callback);
  }

  onChatStarted(callback: (data: { success: boolean; chat: any }) => void) {
    this.socket?.on("chatStarted", callback);
  }

  // Chat actions
  getChatList() {
    if (this.socket) {
      this.socket.emit("getChatList");
    }
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("joinChat", { chatId });
    }
  }

  leaveChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("leaveChat", { chatId });
    }
  }

  sendMessage(chatId: string, content: string) {
    if (this.socket) {
      this.socket.emit("sendMessage", { chatId, content });
    }
  }

  startChatByEmail(recipientEmail: string, initialMessage?: string) {
    if (this.socket) {
      this.socket.emit("startChatByEmail", { recipientEmail, initialMessage });
    }
  }

  // Remove specific listeners
  offMessage(callback?: (message: SocketMessage) => void) {
    this.socket?.off("message", callback);
  }

  offChatUpdated(callback?: (update: ChatUpdate) => void) {
    this.socket?.off("chatUpdated", callback);
  }

  offChatCreated(callback?: (chat: Chat) => void) {
    this.socket?.off("chatCreated", callback);
  }

  offChatListInitial(callback?: (chats: Chat[]) => void) {
    this.socket?.off("chatListInitial", callback);
  }

  offChatStarted(callback?: (data: { success: boolean; chat: any }) => void) {
    this.socket?.off("chatStarted", callback);
  }
}

export const socketService = new SocketService();
