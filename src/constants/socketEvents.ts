/**
 * WebSocket Event Constants
 * Must match backend constants for consistency
 */

export const SOCKET_EVENTS = {
  // Client -> Server
  GET_CHAT_LIST: "getChatList",
  JOIN_CHAT: "joinChat",
  LEAVE_CHAT: "leaveChat",
  SEND_MESSAGE: "sendMessage",
  START_CHAT_BY_EMAIL: "startChatByEmail",

  // Server -> Client
  CHAT_LIST_INITIAL: "chatListInitial",
  CHAT_JOINED: "chatJoined",
  CHAT_LEFT: "chatLeft",
  MESSAGE: "message",
  CHAT_UPDATED: "chatUpdated",
  CHAT_CREATED: "chatCreated",
  ERROR: "error",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
