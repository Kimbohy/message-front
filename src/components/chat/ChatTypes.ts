export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number; // epoch ms
  status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatSummary {
  id: string;
  name: string;
  emoji?: string;
  lastMessage?: ChatMessage;
  lastSeen?: string;
  unreadCount?: number;
  isGroup?: boolean;
  isOnline?: boolean;
  avatarUrl?: string;
}

export interface ChatState {
  chats: ChatSummary[];
  messages: Record<string, ChatMessage[]>; // chatId -> messages
  activeChatId?: string;
  selfUserId: string;
  selfName: string;
  darkMode: boolean;
}
