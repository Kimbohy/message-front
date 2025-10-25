/**
 * WebSocket Types
 */

import type { Chat, LastMessage } from "./chat.types";
import type { Message } from "./message.types";

export interface SocketMessage extends Message {
  senderEmail: string;
}

export interface ChatUpdateEvent {
  chatId: string;
  lastMessage: LastMessage;
  updatedAt: string;
}

export interface ChatJoinedEvent {
  chatId: string;
}

export interface ChatLeftEvent {
  chatId: string;
}

export interface SocketErrorEvent {
  message: string;
  timestamp?: string;
}

export interface SocketEventHandlers {
  onMessage?: (message: SocketMessage) => void;
  onChatUpdated?: (update: ChatUpdateEvent) => void;
  onChatCreated?: (chat: Chat) => void;
  onChatListInitial?: (chats: Chat[]) => void;
  onChatJoined?: (data: ChatJoinedEvent) => void;
  onChatLeft?: (data: ChatLeftEvent) => void;
  onError?: (error: SocketErrorEvent) => void;
}
