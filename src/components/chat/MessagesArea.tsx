import { useEffect, useMemo, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../../services/api";

interface MessagesAreaProps {
  messages: Message[];
  selfUserId: string;
}

export function MessagesArea({ messages, selfUserId }: MessagesAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const dayGroups = useMemo(() => {
    const groups: { day: string; items: Message[] }[] = [];
    let byDay: Record<string, Message[]> = {};

    messages.forEach((m) => {
      const day = new Date(m.createdAt).toDateString();
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
    <div className="flex-1 overflow-y-auto chat-wallpaper px-12 py-6">
      {dayGroups.map((group) => (
        <div key={group.day} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-[13px] px-3 py-1 rounded-lg bg-wp-header-bg/80 text-wp-text-secondary shadow-sm">
              {group.day}
            </span>
          </div>
          {group.items.map((message) => {
            const isOutgoing = message.senderId === selfUserId;
            return (
              <MessageBubble
                key={message._id}
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
