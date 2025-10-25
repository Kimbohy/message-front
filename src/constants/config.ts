/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },
  CHAT: {
    LIST: "/chat",
    CREATE: "/chat",
    MESSAGES: (chatId: string) => `/chat/${chatId}/messages`,
  },
} as const;

/**
 * WebSocket Configuration
 */
export const WEBSOCKET_CONFIG = {
  RECONNECTION_DELAY: 1000,
  MAX_RECONNECTION_ATTEMPTS: 5,
  TIMEOUT: 10000,
} as const;

/**
 * Chat Configuration
 */
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MESSAGE_LOAD_LIMIT: 50,
  TYPING_INDICATOR_TIMEOUT: 3000,
} as const;
