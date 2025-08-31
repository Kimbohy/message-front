import type { Chat } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface ChatListItemProps {
  chat: Chat;
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
  const { user: currentUser } = useAuth();

  // Determine display name for the chat
  const getDisplayName = () => {
    if (chat.type === "GROUP") {
      return chat.name || `Group (${chat.participants.length} members)`;
    } else {
      // For private chats, show the other participant's name
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUser?._id
      );
      return otherParticipant?.name || "Unknown User";
    }
  };

  const displayName = getDisplayName();
  const avatarColor = getAvatarColor(displayName);

  // Get avatar initials
  const getInitials = () => {
    return displayName.slice(0, 2).toUpperCase();
  };

  // Format last message time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffHours < 168) {
      // 7 days
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors hover:bg-wp-hover ${
        isActive ? "bg-wp-dark-hover" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`w-[49px] h-[49px] rounded-full flex items-center justify-center text-white font-medium text-[18px] ${avatarColor}`}
        >
          {getInitials()}
        </div>

        {/* Online indicator for private chats - placeholder for now */}
        {chat.type === "PRIVATE" && (
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
              {displayName}
            </h3>
            {chat.type === "GROUP" && (
              <span className="text-wp-text-secondary text-xs">~</span>
            )}
          </div>
          {chat.lastMessage && (
            <span className="text-[12px] text-wp-text-secondary flex-shrink-0 ml-3 mt-0.5">
              {formatMessageTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <p className="text-[14px] truncate text-wp-text-secondary leading-tight">
              {chat.lastMessage ? (
                <>
                  {chat.lastMessage.senderEmail === currentUser?.email
                    ? "You: "
                    : ""}
                  {chat.lastMessage.content}
                </>
              ) : (
                "No messages yet"
              )}
            </p>
          </div>

          {/* Unread indicator - placeholder for now */}
          {chat.lastMessage &&
            chat.lastMessage.senderEmail !== currentUser?.email && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <span className="w-2 h-2 bg-wp-green rounded-full"></span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
