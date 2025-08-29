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
  isLastItem?: boolean;
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

export function ChatListItem({
  chat,
  isActive,
  onClick,
  isLastItem = false,
}: ChatListItemProps) {
  const avatarColor = getAvatarColor(chat.name);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors hover:bg-wp-hover ${
        isActive ? "bg-wp-dark-hover" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-[49px] h-[49px] rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-[49px] h-[49px] rounded-full flex items-center justify-center text-white font-medium text-[18px] ${avatarColor}`}
          >
            {chat.emoji || chat.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {chat.isOnline && (
          <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-wp-online rounded-full border-2 border-wp-header-bg"></div>
        )}
      </div>

      <div
        className={`flex-1 min-w-0 pb-3 ${
          !isLastItem ? "border-b border-wp-border/30" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <h3 className="font-normal truncate text-wp-text-primary text-[17px] leading-tight">
              {chat.name}
            </h3>
            {chat.isGroup && (
              <span className="text-wp-text-secondary text-xs">~</span>
            )}
          </div>
          {chat.lastMessage && (
            <span className="text-[12px] text-wp-text-secondary flex-shrink-0 ml-3 mt-0.5">
              {formatLastSeen(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <p className="text-[14px] truncate text-wp-text-secondary leading-tight">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
          </div>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              <span className="min-w-[20px] h-[20px] flex items-center justify-center text-[12px] font-semibold text-white rounded-full px-1.5 bg-wp-green">
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
