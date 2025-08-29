import { DotsIcon, SearchIcon } from "./Icons";

interface ChatHeaderProps {
  activeChat: {
    name: string;
    emoji: string;
    isOnline: boolean;
    lastSeen: string;
  };
}

export function ChatHeader({ activeChat }: ChatHeaderProps) {
  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-wp-border bg-wp-header-bg">
      <div className="relative">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm bg-wp-green text-white">
          {activeChat.emoji || activeChat.name.slice(0, 2).toUpperCase()}
        </div>
        {activeChat.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-wp-online rounded-full border-2 border-wp-header-bg"></div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="font-semibold text-wp-text-primary text-lg">
          {activeChat.name}
        </h2>
        <p className="text-sm text-wp-text-secondary">
          {activeChat.isOnline ? (
            <span className="text-wp-online flex items-center gap-1">
              <span className="w-2 h-2 bg-wp-online rounded-full"></span>
              online
            </span>
          ) : (
            activeChat.lastSeen
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
          <SearchIcon />
        </button>
        <button className="p-2.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
          <DotsIcon />
        </button>
      </div>
    </header>
  );
}
