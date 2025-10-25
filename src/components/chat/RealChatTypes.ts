import type {
  Chat as ApiChat,
  Message as ApiMessage,
  User,
} from "../../services/api";

// Extended types that include additional UI-specific properties
export interface ChatMessage extends Omit<ApiMessage, "createdAt"> {
  id: string; // Alias for _id for compatibility
  senderName: string; // Derived from user data
  timestamp: number; // Converted from createdAt string
  status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatSummary
  extends Omit<ApiChat, "_id" | "participants" | "createdAt" | "updatedAt"> {
  id: string; // Alias for _id for compatibility
  participants: User[];
  unreadCount?: number;
  isOnline?: boolean;
  displayName: string; // Computed display name
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Utility functions to convert API types to UI types
export function convertApiMessageToUI(
  apiMessage: ApiMessage,
  users: Record<string, User>
): ChatMessage {
  const sender = users[apiMessage.senderId];
  return {
    ...apiMessage,
    id: apiMessage._id,
    senderName: sender?.name || apiMessage.senderEmail || "Unknown",
    timestamp: new Date(apiMessage.createdAt).getTime(),
    status: "delivered",
  };
}

export function convertApiChatToUI(
  apiChat: ApiChat,
  currentUserId: string
): ChatSummary {
  // For private chats, display name is the other participant's name
  // For group chats, use the chat name or "Group chat"
  let displayName = apiChat.name || "Chat";

  if (apiChat.type === "PRIVATE" && apiChat.participants.length >= 2) {
    const otherParticipant = apiChat.participants.find(
      (p) => p._id !== currentUserId
    );
    displayName = otherParticipant?.name || "Unknown User";
  } else if (apiChat.type === "GROUP") {
    displayName =
      apiChat.name || `Group (${apiChat.participants.length} members)`;
  }

  return {
    ...apiChat,
    id: apiChat._id,
    displayName,
    isOnline: false, // This would need to be determined by presence system
    unreadCount: 0, // This would need to be tracked separately
  };
}
