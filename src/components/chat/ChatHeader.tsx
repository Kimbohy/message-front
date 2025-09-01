import { DotsIcon, SearchIcon, ArrowBackIcon } from "./Icons";
import type { Chat } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface ChatHeaderProps {
  activeChat: Chat | null;
  onBackToSidebar?: () => void;
}

export function ChatHeader({ activeChat, onBackToSidebar }: ChatHeaderProps) {
  const { user: currentUser } = useAuth();

  if (!activeChat) return null;

  // Determine display name and status
  const getDisplayInfo = () => {
    if (activeChat.type === "GROUP") {
      return {
        name:
          activeChat.name ||
          `Group (${activeChat.participants.length} members)`,
        status: `${activeChat.participants.length} members`,
        isOnline: false,
      };
    } else {
      const otherParticipant = activeChat.participants.find(
        (p) => p._id !== currentUser?._id
      );
      return {
        name: otherParticipant?.name || "Unknown User",
        status: "last seen recently", // This would come from a presence system
        isOnline: true, // Placeholder
      };
    }
  };

  const { name, status, isOnline } = getDisplayInfo();

  // Get initials for avatar
  const getInitials = () => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-[60px] flex items-center gap-4 px-4 md:px-6 border-b border-wp-border bg-wp-header-bg flex-shrink-0">
      {/* Mobile Back Button - Only show when there's an active chat */}
      {activeChat && onBackToSidebar && (
        <button
          onClick={onBackToSidebar}
          className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary md:hidden"
        >
          <ArrowBackIcon />
        </button>
      )}

      {activeChat && (
        <>
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm bg-wp-green text-white">
              {getInitials()}
            </div>
            {isOnline && activeChat.type === "PRIVATE" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-wp-online rounded-full border-2 border-wp-header-bg"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-wp-text-primary text-[17px] leading-tight truncate">
              {name}
            </h2>
            <p className="text-[13px] text-wp-text-secondary leading-tight truncate">
              {isOnline && activeChat.type === "PRIVATE" ? (
                <span className="text-wp-online flex items-center gap-1">
                  online
                </span>
              ) : (
                status
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
              <SearchIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
              <DotsIcon />
            </button>
          </div>
        </>
      )}
    </header>
  );
}
