import { useEffect, useMemo, useRef, useState } from "react";
import { useMockChat } from "./useMockChat";
import type { ChatMessage, ChatSummary } from "./ChatTypes";

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatLastSeen(ts: number) {
  const now = new Date();
  const msgDate = new Date(ts);
  const diffTime = now.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return formatTime(ts);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return msgDate.toLocaleDateString([], { weekday: "short" });
  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
}

// WhatsApp-style icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const AttachIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
    <path d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v2H9.41c-.55 0-.55 1 0 1H18c1.1 0 2-.9 2-2s-.9-2-2-2H7.5C5.57 9 4 10.57 4 12.5S5.57 16 7.5 16H17v2H7.5C4.46 18 2 15.54 2 12.5z" />
  </svg>
);

const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

export function ChatApp() {
  const { state, activeChat, activeMessages, sendMessage, setActiveChat } =
    useMockChat();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "favorites" | "groups"
  >("all");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, state.activeChatId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  const filteredChats = useMemo(() => {
    let chats = state.chats;

    // Apply search filter
    if (searchQuery.trim()) {
      chats = chats.filter((chat: any) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    switch (activeFilter) {
      case "unread":
        return chats.filter((chat: any) => chat.unreadCount > 0);
      case "favorites":
        return chats.filter((chat: any) => chat.isFavorite); // We can add this later
      case "groups":
        return chats.filter((chat: any) => chat.isGroup);
      default:
        return chats;
    }
  }, [state.chats, searchQuery, activeFilter]);

  const dayGroups = useMemo(() => {
    const groups: { day: string; items: ChatMessage[] }[] = [];
    let byDay: Record<string, ChatMessage[]> = {};
    activeMessages.forEach((m: any) => {
      const day = new Date(m.timestamp).toDateString();
      (byDay[day] ||= []).push(m);
    });
    Object.entries(byDay).forEach(([day, items]) => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let displayDay = day;
      if (day === today) displayDay = "Today";
      else if (day === yesterday) displayDay = "Yesterday";
      else
        displayDay = new Date(day).toLocaleDateString([], {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      groups.push({ day: displayDay, items });
    });
    return groups;
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !state.activeChatId) return;
    sendMessage(state.activeChatId, input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-wp-dark-bg">
      {/* WhatsApp-style Sidebar */}
      <aside className="hidden md:flex flex-col w-80 border-r border-wp-border bg-wp-dark-bg">
        {/* WhatsApp Header */}
        <div className="bg-wp-header-bg">
          <div className="h-16 flex items-center justify-between px-4 text-wp-text-primary">
            <h1 className="font-medium text-xl">WhatsApp</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
                <span className="text-lg">☀️</span>
              </button>
              <button className="p-2 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary">
                <DotsIcon />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wp-text-secondary">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start a new chat"
                className="w-full pl-12 pr-4 py-3 text-sm rounded-lg outline-none bg-wp-dark-bg border border-wp-border focus:border-wp-green text-wp-text-primary placeholder-wp-text-secondary"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pb-2">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeFilter === "all"
                    ? "bg-wp-green text-white"
                    : "text-wp-text-secondary hover:bg-wp-hover"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeFilter === "unread"
                    ? "bg-wp-green text-white"
                    : "text-wp-text-secondary hover:bg-wp-hover"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setActiveFilter("favorites")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeFilter === "favorites"
                    ? "bg-wp-green text-white"
                    : "text-wp-text-secondary hover:bg-wp-hover"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveFilter("groups")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeFilter === "groups"
                    ? "bg-wp-green text-white"
                    : "text-wp-text-secondary hover:bg-wp-hover"
                }`}
              >
                Groups
              </button>
            </div>
          </div>
        </div>

        {/* Simple Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors hover:bg-wp-hover ${
                chat.id === state.activeChatId ? "bg-wp-dark-hover" : ""
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
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-wp-chat-bg">
        {activeChat ? (
          <>
            {/* Simple Chat Header */}
            <header className="h-16 flex items-center gap-4 px-6 border-b border-wp-border bg-wp-header-bg">
              <div className="relative">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm bg-wp-green text-white">
                  {activeChat.emoji ||
                    activeChat.name.slice(0, 2).toUpperCase()}
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

            {/* Messages Area with WhatsApp background */}
            <div className="flex-1 overflow-y-auto chat-wallpaper px-6 py-4">
              {dayGroups.map((group) => (
                <div key={group.day} className="mb-8">
                  <div className="flex justify-center mb-6">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-wp-header-bg text-wp-text-secondary shadow-sm">
                      {group.day}
                    </span>
                  </div>
                  {group.items.map((message) => {
                    const isOutgoing = message.senderId === state.selfUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex mb-2 ${
                          isOutgoing ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`msg-bubble ${
                            isOutgoing ? "msg-bubble-out" : "msg-bubble-in"
                          }`}
                        >
                          <div className="text-sm leading-relaxed text-wp-text-primary">
                            {message.content}
                          </div>
                          <div className="flex items-center justify-end gap-1.5 mt-1">
                            <span className="text-xs text-wp-text-muted">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOutgoing && (
                              <span
                                className={`text-xs font-semibold ${
                                  message.status === "sending"
                                    ? "status-sending"
                                    : message.status === "sent"
                                    ? "status-sent"
                                    : message.status === "delivered"
                                    ? "status-delivered"
                                    : "status-read"
                                }`}
                              >
                                {message.status === "sending"
                                  ? "🕒"
                                  : message.status === "sent"
                                  ? "✓"
                                  : message.status === "delivered"
                                  ? "✓✓"
                                  : "✓✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* WhatsApp-style Input Area */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-wp-header-bg border-t border-wp-border"
            >
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  className="p-2.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
                >
                  <AttachIcon />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type a message"
                    rows={1}
                    className="w-full resize-none rounded-lg px-4 py-3 pr-12 outline-none text-sm bg-wp-input-bg border border-wp-border focus:border-wp-green text-wp-text-primary placeholder-wp-text-muted transition-all duration-200"
                    style={{ maxHeight: "120px" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
                  >
                    <EmojiIcon />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 rounded-full bg-wp-green hover:bg-wp-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-wp-chat-bg">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-wp-green/10 flex items-center justify-center">
                <span className="text-6xl">💬</span>
              </div>
              <h2 className="text-2xl font-light mb-3 text-wp-text-primary">
                WhatsApp Web
              </h2>
              <p className="text-sm text-wp-text-secondary max-w-md mx-auto">
                Send and receive messages without keeping your phone online.
                <br />
                Use WhatsApp on up to 4 linked devices and 1 phone at the same
                time.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
