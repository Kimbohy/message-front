import { useMemo } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ChatListItem } from "./ChatListItem";

interface ChatSidebarProps {
  chats: any[];
  activeChatId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "unread" | "favourites" | "groups";
  onFilterChange: (filter: "all" | "unread" | "favourites" | "groups") => void;
  onChatSelect: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onChatSelect,
}: ChatSidebarProps) {
  const filteredChats = useMemo(() => {
    let filteredChats = chats;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredChats = filteredChats.filter((chat: any) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    switch (activeFilter) {
      case "unread":
        return filteredChats.filter((chat: any) => chat.unreadCount > 0);
      case "favourites":
        return filteredChats.filter((chat: any) => chat.isFavorite);
      case "groups":
        return filteredChats.filter((chat: any) => chat.isGroup);
      default:
        return filteredChats;
    }
  }, [chats, searchQuery, activeFilter]);

  return (
    <aside className="hidden md:flex flex-col w-[420px] border-r border-wp-border bg-wp-header-bg">
      <SidebarHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.map((chat: any, index: number) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onChatSelect(chat.id)}
            isLastItem={index === filteredChats.length - 1}
          />
        ))}
      </div>
    </aside>
  );
}
