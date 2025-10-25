import type { Message } from "../../services/api";

interface MessageBubbleProps {
  message: Message;
  isOutgoing: boolean;
}

export function MessageBubble({ message, isOutgoing }: MessageBubbleProps) {
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex mb-2 ${isOutgoing ? "justify-end" : "justify-start"}`}
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
            {formatMessageTime(message.createdAt)}
          </span>
          {isOutgoing && (
            <span className="text-xs font-semibold text-wp-text-muted">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
