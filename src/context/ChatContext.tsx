import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { socketService } from "../services/socket";
import { apiService } from "../services/api";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";
import type { Chat, Message } from "../services/api";
import type { SocketMessage, ChatUpdate } from "../services/socket";

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "ADD_CHAT"; payload: Chat }
  | { type: "UPDATE_CHAT"; payload: ChatUpdate }
  | { type: "SET_ACTIVE_CHAT"; payload: string | null }
  | { type: "SET_MESSAGES"; payload: { chatId: string; messages: Message[] } }
  | { type: "ADD_MESSAGE"; payload: Message }
  | {
      type: "UPDATE_MESSAGE_STATUS";
      payload: { messageId: string; status: "sent" | "delivered" | "read" };
    }
  | { type: "CLEAR_STATE" };

const initialState: ChatState = {
  chats: [],
  messages: {},
  activeChatId: null,
  isLoading: false,
  error: null,
  isConnected: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };
    case "SET_CHATS":
      return { ...state, chats: action.payload, isLoading: false };
    case "ADD_CHAT":
      return {
        ...state,
        chats: [action.payload, ...state.chats].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
      };
    case "UPDATE_CHAT": {
      const { chatId, lastMessage, updatedAt } = action.payload;
      return {
        ...state,
        chats: state.chats
          .map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage, updatedAt } : chat
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
      };
    }
    case "SET_ACTIVE_CHAT":
      return { ...state, activeChatId: action.payload };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };
    case "ADD_MESSAGE": {
      const message = action.payload;
      const chatMessages = state.messages[message.chatId] || [];

      // Don't add if message already exists (avoid duplicates)
      const messageExists = chatMessages.some((msg) => msg._id === message._id);
      if (messageExists) {
        return state;
      }

      // If this is a real message from server and we have a temp message with same content/sender, remove the temp one
      if (!message._id.startsWith("temp-")) {
        const filteredMessages = chatMessages.filter((msg) => {
          // Remove temp messages that match this real message
          return !(
            (
              msg._id.startsWith("temp-") &&
              msg.senderId === message.senderId &&
              msg.content === message.content &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 30000
            ) // Within 30 seconds
          );
        });

        return {
          ...state,
          messages: {
            ...state.messages,
            [message.chatId]: [...filteredMessages, message],
          },
        };
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          [message.chatId]: [...chatMessages, message],
        },
      };
    }
    case "UPDATE_MESSAGE_STATUS": {
      const { messageId, status } = action.payload;
      const newMessages = { ...state.messages };

      for (const chatId in newMessages) {
        newMessages[chatId] = newMessages[chatId].map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        );
      }

      return { ...state, messages: newMessages };
    }
    case "CLEAR_STATE":
      return initialState;
    default:
      return state;
  }
}

interface ChatContextType extends ChatState {
  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string) => void;
  createChat: (
    participants: string[],
    type: "GROUP" | "PRIVATE",
    name?: string
  ) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  const connectSocket = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await socketService.connect();
      dispatch({ type: "SET_CONNECTED", payload: true });

      // Set up socket event listeners
      socketService.onChatListInitial((chats) => {
        dispatch({ type: "SET_CHATS", payload: chats });
      });

      socketService.onMessage((socketMessage: SocketMessage) => {
        const message: Message = {
          _id: socketMessage._id,
          chatId: socketMessage.chatId,
          senderId: socketMessage.senderId,
          senderEmail: socketMessage.senderEmail,
          content: socketMessage.content,
          createdAt: socketMessage.createdAt,
        };

        // Just add the message - the ADD_MESSAGE reducer will handle deduplication
        dispatch({ type: "ADD_MESSAGE", payload: message });
      });

      socketService.onChatUpdated((update) => {
        dispatch({ type: "UPDATE_CHAT", payload: update });
      });

      socketService.onChatCreated((chat) => {
        dispatch({ type: "ADD_CHAT", payload: chat });
      });

      // Request initial chat list
      socketService.getChatList();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to connect to chat server",
      });
      dispatch({ type: "SET_CONNECTED", payload: false });
    }
  }, [isAuthenticated]);

  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    dispatch({ type: "SET_CONNECTED", payload: false });
  }, []);

  const loadChats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const chats = await apiService.getChats();
      dispatch({ type: "SET_CHATS", payload: chats });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load chats";
      dispatch({ type: "SET_ERROR", payload: message });
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const messages = await apiService.getMessages(chatId);
      dispatch({ type: "SET_MESSAGES", payload: { chatId, messages } });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load messages";
      dispatch({ type: "SET_ERROR", payload: message });
    }
  }, []);

  const setActiveChat = useCallback(
    (chatId: string | null) => {
      // Leave previous chat room
      if (state.activeChatId) {
        socketService.leaveChat(state.activeChatId);
      }

      dispatch({ type: "SET_ACTIVE_CHAT", payload: chatId });

      // Join new chat room and load messages
      if (chatId) {
        socketService.joinChat(chatId);
        loadMessages(chatId);
      }
    },
    [state.activeChatId, loadMessages]
  );

  const sendMessage = useCallback(
    (chatId: string, content: string) => {
      if (!state.isConnected || !user) return;

      const timestamp = Date.now();
      const tempId = `temp-${user._id}-${timestamp}`;

      // Optimistically add message to UI
      const tempMessage: Message = {
        _id: tempId,
        chatId,
        senderId: user._id,
        senderEmail: user.email,
        content,
        createdAt: new Date(timestamp).toISOString(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: tempMessage });

      // Send through socket
      socketService.sendMessage(chatId, content);
    },
    [state.isConnected, user]
  );

  const createChat = useCallback(
    async (
      participants: string[],
      type: "GROUP" | "PRIVATE",
      name?: string
    ) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await apiService.createChat({ participants, type, name });
        // The chat will be added via socket event
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create chat";
        dispatch({ type: "SET_ERROR", payload: message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
      dispatch({ type: "CLEAR_STATE" });
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, connectSocket, disconnectSocket]);

  const contextValue: ChatContextType = {
    ...state,
    connectSocket,
    disconnectSocket,
    loadChats,
    loadMessages,
    setActiveChat,
    sendMessage,
    createChat,
    clearError,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
