import { formatLastSeen } from "./utils";

interface ChatListItemProps {
  chat: {
    id: string;
    name: string;
    emoji: string;
    isOnline: boolean;
    unreadCount: number;
    lastMessage?: {
      content: string;
      timestamp: number;
    };
  };
  isActive: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors hover:bg-wp-hover ${
        isActive ? "bg-wp-dark-hover" : ""
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-wp-green text-white">
          {chat.emoji || chat.name.slice(0, 2).toUpperCase()}
        </div>
        {chat.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-wp-online rounded-full border-2 border-wp-dark-bg"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold truncate text-wp-text-primary">
            {chat.name}
          </h3>
          {chat.lastMessage && (
            <span className="text-xs shrink-0 ml-2 text-wp-text-secondary">
              {formatLastSeen(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm truncate text-wp-text-secondary">
            {chat.lastMessage?.content || "No messages yet"}
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="ml-2 min-w-[1.25rem] h-6 flex items-center justify-center text-xs font-bold text-white rounded-full px-2 bg-wp-green">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
