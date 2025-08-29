import { formatTime } from "./utils";
import type { ChatMessage } from "./ChatTypes";

interface MessageBubbleProps {
  message: ChatMessage;
  isOutgoing: boolean;
}

export function MessageBubble({ message, isOutgoing }: MessageBubbleProps) {
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
}
