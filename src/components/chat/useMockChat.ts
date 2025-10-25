import { useCallback, useState } from "react";
import type { ChatMessage, ChatState } from "./ChatTypes";

export function useMockChat() {
  const [state, setState] = useState<ChatState>(() => {
    const userId = "me";
    const contacts = [
      { name: "Sophie Martinez 🌸", emoji: "👩‍💻", lastSeen: "online" },
      {
        name: "Dev Team 💻",
        emoji: "👥",
        lastSeen: "8 members",
        isGroup: true,
      },
      {
        name: "Alex Chen 🚀",
        emoji: "👨‍🚀",
        lastSeen: "last seen today at 3:45 PM",
      },
      {
        name: "Coffee Lovers ☕",
        emoji: "☕",
        lastSeen: "12 members",
        isGroup: true,
      },
      {
        name: "Emma Thompson 📚",
        emoji: "👩‍🎓",
        lastSeen: "last seen today at 11:20 AM",
      },
      {
        name: "Food Delivery",
        emoji: "🍕",
        lastSeen: "last seen yesterday at 8:30 PM",
      },
      {
        name: "Ryan Wilson 🎸",
        emoji: "👨‍🎤",
        lastSeen: "online",
      },
      {
        name: "Study Group 📖",
        emoji: "📚",
        lastSeen: "5 members",
        isGroup: true,
      },
    ];

    const chats = contacts.map((contact, i) => ({
      id: `c${i + 1}`,
      name: contact.name,
      emoji: contact.emoji,
      lastSeen: contact.lastSeen,
      unreadCount: i < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
      isGroup: contact.isGroup || false,
      isOnline: contact.lastSeen === "online",
    }));

    // Add realistic mock messages
    const mockMessages: Record<string, ChatMessage[]> = {};
    chats.forEach((chat, index) => {
      const messages: ChatMessage[] = [];

      // Add different mock conversations for each chat
      if (index === 0) {
        // Sophie Martinez
        messages.push({
          id: "1",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "Hey! Just finished the new design mockups 🎨",
          timestamp: Date.now() - 1000 * 60 * 15,
          status: "delivered",
        });
        messages.push({
          id: "2",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "Awesome! Can't wait to see them 👀",
          timestamp: Date.now() - 1000 * 60 * 10,
          status: "read",
        });
        messages.push({
          id: "3",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "I'll share them in the team channel in a few minutes",
          timestamp: Date.now() - 1000 * 60 * 5,
          status: "delivered",
        });
      } else if (index === 1) {
        // Dev Team
        messages.push({
          id: "4",
          chatId: chat.id,
          senderId: "alice-dev",
          senderName: "Alice",
          content: "🚀 Deploy to staging is complete!",
          timestamp: Date.now() - 1000 * 60 * 45,
          status: "delivered",
        });
        messages.push({
          id: "5",
          chatId: chat.id,
          senderId: "bob-dev",
          senderName: "Bob",
          content: "Great work team! QA testing starts tomorrow",
          timestamp: Date.now() - 1000 * 60 * 30,
          status: "delivered",
        });
        messages.push({
          id: "6",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "Perfect timing! I'll review the staging environment now",
          timestamp: Date.now() - 1000 * 60 * 25,
          status: "read",
        });
      } else if (index === 2) {
        // Alex Chen
        messages.push({
          id: "7",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "Are we still on for the meeting at 4 PM? 🤔",
          timestamp: Date.now() - 1000 * 60 * 20,
          status: "delivered",
        });
        messages.push({
          id: "8",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "Yes! See you in the conference room",
          timestamp: Date.now() - 1000 * 60 * 18,
          status: "sent",
        });
      } else if (index === 3) {
        // Coffee Lovers
        messages.push({
          id: "9",
          chatId: chat.id,
          senderId: "sarah-coffee",
          senderName: "Sarah",
          content: "Found this amazing new café downtown! ☕",
          timestamp: Date.now() - 1000 * 60 * 60,
          status: "delivered",
        });
        messages.push({
          id: "10",
          chatId: chat.id,
          senderId: "mike-coffee",
          senderName: "Mike",
          content: "Ooh! Is it the one with the specialty roasts?",
          timestamp: Date.now() - 1000 * 60 * 55,
          status: "delivered",
        });
        messages.push({
          id: "11",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "Count me in for the weekend coffee run! 🙋‍♂️",
          timestamp: Date.now() - 1000 * 60 * 50,
          status: "read",
        });
      } else if (index === 4) {
        // Emma Thompson
        messages.push({
          id: "12",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "Thanks for lending me that book! 📖",
          timestamp: Date.now() - 86400000 + 1000 * 60 * 30,
          status: "delivered",
        });
        messages.push({
          id: "13",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "How did you like it?",
          timestamp: Date.now() - 86400000 + 1000 * 60 * 35,
          status: "read",
        });
        messages.push({
          id: "14",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content:
            "Absolutely loved it! Do you have any other recommendations?",
          timestamp: Date.now() - 1000 * 60 * 120,
          status: "delivered",
        });
      } else if (index === 5) {
        // Food Delivery
        messages.push({
          id: "15",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "Your order has been delivered! 🍕",
          timestamp: Date.now() - 86400000,
          status: "delivered",
        });
      } else if (index === 6) {
        // Ryan Wilson
        messages.push({
          id: "16",
          chatId: chat.id,
          senderId: chat.id + "-user",
          senderName: chat.name,
          content: "Band practice tonight! Don't forget your amp 🎸",
          timestamp: Date.now() - 1000 * 60 * 8,
          status: "delivered",
        });
        messages.push({
          id: "17",
          chatId: chat.id,
          senderId: userId,
          senderName: "You",
          content: "Got it! See you at 7 PM 🤘",
          timestamp: Date.now() - 1000 * 60 * 5,
          status: "sent",
        });
      } else if (index === 7) {
        // Study Group
        messages.push({
          id: "18",
          chatId: chat.id,
          senderId: "jenny-study",
          senderName: "Jenny",
          content: "Quiz tomorrow! Anyone wants to review together? 📚",
          timestamp: Date.now() - 1000 * 60 * 90,
          status: "delivered",
        });
        messages.push({
          id: "19",
          chatId: chat.id,
          senderId: "tom-study",
          senderName: "Tom",
          content: "I'm in! Library at 6 PM?",
          timestamp: Date.now() - 1000 * 60 * 85,
          status: "delivered",
        });
      }

      mockMessages[chat.id] = messages;
    });

    // Update chats with last messages
    const chatsWithLastMessages = chats.map((chat) => {
      const chatMessages = mockMessages[chat.id];
      const lastMessage =
        chatMessages && chatMessages.length > 0
          ? chatMessages[chatMessages.length - 1]
          : null;
      return lastMessage ? { ...chat, lastMessage } : chat;
    });

    return {
      chats: chatsWithLastMessages,
      messages: mockMessages,
      activeChatId: chatsWithLastMessages[0].id,
      selfUserId: userId,
      selfName: "You",
      darkMode: true, // Default to dark mode like WhatsApp
    };
  });

  // No auto-message simulation - just static mock data

  const sendMessage = useCallback((chatId: string, content: string) => {
    setState((s) => {
      const tempId = crypto.randomUUID();
      const msg: ChatMessage = {
        id: tempId,
        chatId,
        senderId: s.selfUserId,
        senderName: s.selfName,
        content,
        timestamp: Date.now(),
        status: "sending",
      };
      const messages = {
        ...s.messages,
        [chatId]: [...s.messages[chatId], msg],
      };
      const chats = s.chats.map((c) =>
        c.id === chatId ? { ...c, lastMessage: msg } : c
      );
      return { ...s, messages, chats };
    });

    // Simulate server ack
    setTimeout(() => {
      setState((s) => {
        const messages = { ...s.messages };
        messages[chatId] = messages[chatId].map((m) =>
          m.status === "sending" ? { ...m, status: "sent" } : m
        );
        return { ...s, messages };
      });
    }, 600);
  }, []);

  const setActiveChat = useCallback((chatId: string) => {
    setState((s) => ({
      ...s,
      activeChatId: chatId,
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  }, []);

  const toggleDarkMode = useCallback(
    () => setState((s) => ({ ...s, darkMode: !s.darkMode })),
    []
  );

  const activeMessages = state.activeChatId
    ? state.messages[state.activeChatId]
    : [];
  const activeChat = state.chats.find((c) => c.id === state.activeChatId);

  return {
    state,
    activeChat,
    activeMessages,
    sendMessage,
    setActiveChat,
    toggleDarkMode,
  };
}
