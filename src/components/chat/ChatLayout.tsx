import { useEffect, useState } from "react";
import { useMockChat } from "./useMockChat";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";

export function ChatApp() {
  const { state, activeChat, activeMessages, sendMessage, setActiveChat } =
    useMockChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "favourites" | "groups"
  >("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-wp-dark-bg">
      <ChatSidebar
        chats={state.chats}
        activeChatId={state.activeChatId || ""}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onChatSelect={setActiveChat}
      />

      <ChatArea
        activeChat={activeChat}
        activeMessages={activeMessages}
        selfUserId={state.selfUserId}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
