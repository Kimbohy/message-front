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
    isGroup?: boolean;
    avatar?: string;
  };
  isActive: boolean;
  onClick: () => void;
}

// Generate avatar colors based on name
function getAvatarColor(name: string) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  const avatarColor = getAvatarColor(chat.name);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-wp-hover ${
        isActive ? "bg-wp-dark-hover" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm ${avatarColor}`}
          >
            {chat.emoji || chat.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {chat.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-wp-online rounded-full border-2 border-wp-dark-bg"></div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <h3 className="font-medium truncate text-wp-text-primary text-[15px]">
              {chat.name}
            </h3>
            {chat.isGroup && (
              <span className="text-wp-text-secondary text-xs">~</span>
            )}
          </div>
          {chat.lastMessage && (
            <span className="text-xs text-wp-text-secondary flex-shrink-0 ml-2">
              {formatLastSeen(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <p className="text-sm truncate text-wp-text-secondary leading-tight">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
          </div>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <span className="min-w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold text-white rounded-full px-1.5 bg-wp-green">
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
