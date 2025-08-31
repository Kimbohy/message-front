import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";

export function ChatApp() {
  const {
    chats,
    messages,
    activeChatId,
    isLoading,
    error,
    setActiveChat,
    sendMessage,
    clearError,
  } = useChat();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "favourites" | "groups"
  >("all");

  // Filter chats based on search and active filter
  const filteredChats = chats.filter((chat) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participants.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Type filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "groups" && chat.type === "GROUP") ||
      (activeFilter === "unread" && chat.lastMessage);

    return matchesSearch && matchesFilter;
  });

  const activeChat = activeChatId
    ? chats.find((c) => c._id === activeChatId) || null
    : null;
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
      // You could show a toast notification here
      setTimeout(() => clearError(), 5000);
    }
  }, [error, clearError]);

  if (isLoading && chats.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-wp-dark-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wp-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-wp-text-secondary">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-wp-dark-bg">
      <ChatSidebar
        chats={filteredChats}
        activeChatId={activeChatId || ""}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onChatSelect={setActiveChat}
        isLoading={isLoading}
      />

      <ChatArea
        activeChat={activeChat}
        activeMessages={activeMessages}
        selfUserId={user?._id || ""}
        onSendMessage={sendMessage}
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">{error}</p>
          <button
            onClick={clearError}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
