/**
 * Message Types
 */

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  senderEmail?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  seenBy?: string[];
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
}

export interface MessageStatus {
  messageId: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
}
