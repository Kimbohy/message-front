import { useMemo } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ChatListItem } from "./ChatListItem";
import type { Chat } from "../../services/api";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: "all" | "unread" | "favourites" | "groups";
  onFilterChange: (filter: "all" | "unread" | "favourites" | "groups") => void;
  onChatSelect: (chatId: string) => void;
  onChatStarted?: () => void;
  isLoading?: boolean;
}

export function ChatSidebar({
  chats,
  activeChatId,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onChatSelect,
  onChatStarted,
  isLoading = false,
}: ChatSidebarProps) {
  const filteredChats = useMemo(() => {
    let filteredChats = chats;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredChats = filteredChats.filter((chat) => {
        // Search in chat name or participant names
        const chatName = chat.name || "";
        const participantNames = chat.participants.map((p) => p.name).join(" ");
        const searchText = `${chatName} ${participantNames}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply tab filter
    switch (activeFilter) {
      case "unread":
        return filteredChats.filter((chat) => chat.lastMessage);
      case "groups":
        return filteredChats.filter((chat) => chat.type === "GROUP");
      default:
        return filteredChats;
    }
  }, [chats, searchQuery, activeFilter]);

  return (
    <aside className="flex flex-col w-full md:w-[420px] border-r border-wp-border bg-wp-header-bg h-full">
      <SidebarHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        onChatStarted={onChatStarted}
      />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading && chats.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-wp-text-secondary text-sm">
              Loading chats...
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-wp-text-secondary text-sm">
              {searchQuery ? "No chats found" : "No chats yet"}
            </div>
          </div>
        ) : (
          filteredChats.map((chat, index) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              isActive={chat._id === activeChatId}
              onClick={() => onChatSelect(chat._id)}
              isLastItem={index === filteredChats.length - 1}
            />
          ))
        )}
      </div>
    </aside>
  );
}
