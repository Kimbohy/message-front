import { useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessagesArea } from "./MessagesArea";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import type { Chat, Message } from "../../services/api";

interface ChatAreaProps {
  activeChat: Chat | null;
  activeMessages: Message[];
  selfUserId: string;
  onSendMessage: (chatId: string, content: string) => void;
  onBackToSidebar?: () => void;
  isLoading?: boolean;
}

export function ChatArea({
  activeChat,
  activeMessages,
  selfUserId,
  onSendMessage,
  onBackToSidebar,
  isLoading = false,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat?._id || isLoading) return;
    onSendMessage(activeChat._id, input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!activeChat) {
    return <EmptyState />;
  }

  return (
    <main className="flex-1 flex flex-col bg-wp-chat-bg h-full">
      <ChatHeader activeChat={activeChat} onBackToSidebar={onBackToSidebar} />
      <MessagesArea messages={activeMessages} selfUserId={selfUserId} />
      <MessageInput
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyDown={handleInputKeyDown}
      />
    </main>
  );
}
