import { useEffect, useMemo, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "./ChatTypes";

interface MessagesAreaProps {
  messages: ChatMessage[];
  selfUserId: string;
}

export function MessagesArea({ messages, selfUserId }: MessagesAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const dayGroups = useMemo(() => {
    const groups: { day: string; items: ChatMessage[] }[] = [];
    let byDay: Record<string, ChatMessage[]> = {};

    messages.forEach((m: any) => {
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
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto chat-wallpaper px-6 py-4">
      {dayGroups.map((group) => (
        <div key={group.day} className="mb-8">
          <div className="flex justify-center mb-6">
            <span className="text-xs px-3 py-1.5 rounded-full bg-wp-header-bg text-wp-text-secondary shadow-sm">
              {group.day}
            </span>
          </div>
          {group.items.map((message) => {
            const isOutgoing = message.senderId === selfUserId;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOutgoing={isOutgoing}
              />
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
