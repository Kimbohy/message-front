/**
 * Chat Types
 */

import type { User } from "./user.types";

export type ChatType = "PRIVATE" | "GROUP";

export interface LastMessage {
  content: string;
  senderId: string;
  senderEmail?: string;
  createdAt: string;
  updatedAt: string;
  seenBy?: string[];
}

export interface Chat {
  _id: string;
  type: ChatType;
  name?: string;
  participants: User[];
  lastMessage?: LastMessage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatPayload {
  participants: string[];
  type: ChatType;
  name?: string;
}

export interface StartChatByEmailPayload {
  recipientEmail: string;
  initialMessage?: string;
}
