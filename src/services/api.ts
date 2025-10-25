import { API_ENDPOINTS } from "../constants";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Chat,
  Message,
  CreateChatPayload,
} from "../types";

/**
 * Get API base URL based on environment
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3001/api`;
  }
  return "http://localhost:3001/api";
};

/**
 * ApiService
 * Handles all HTTP REST API communications
 * Manages authentication tokens and request/response handling
 */
class ApiService {
  private baseUrl = getApiBaseUrl();
  private token: string | null = null;
  private readonly TOKEN_KEY = "auth_token";

  constructor() {
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Generic HTTP request handler
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // ==================== Authentication ====================

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(
    userData: RegisterData
  ): Promise<{ message: string; user: User }> {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      {
        method: "POST",
      }
    );
    this.clearToken();
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  // ==================== Chat ====================

  /**
   * Get all chats for authenticated user
   */
  async getChats(): Promise<Chat[]> {
    return this.request<Chat[]>(API_ENDPOINTS.CHAT.LIST);
  }

  /**
   * Create a new chat
   */
  async createChat(chatData: CreateChatPayload): Promise<Chat> {
    return this.request<Chat>(API_ENDPOINTS.CHAT.CREATE, {
      method: "POST",
      body: JSON.stringify(chatData),
    });
  }

  /**
   * Get messages for a specific chat
   */
  async getMessages(chatId: string): Promise<Message[]> {
    return this.request<Message[]>(API_ENDPOINTS.CHAT.MESSAGES(chatId));
  }

  /**
   * Start a chat by email (via WebSocket)
   * This wraps the WebSocket call to provide a Promise-based interface
   */
  async startChatByEmail(payload: {
    recipientEmail: string;
    initialMessage?: string;
  }): Promise<{ chat: Chat }> {
    // Import socketService dynamically to avoid circular dependency
    const { socketService } = await import("./socket");

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Chat creation timeout"));
      }, 10000); // 10 second timeout

      // Listen for chat created event
      const handleChatCreated = (chat: Chat) => {
        clearTimeout(timeout);
        socketService.off({ onChatCreated: handleChatCreated });
        socketService.off({ onError: handleError });
        resolve({ chat });
      };

      // Listen for error event
      const handleError = (error: { message: string }) => {
        clearTimeout(timeout);
        socketService.off({ onChatCreated: handleChatCreated });
        socketService.off({ onError: handleError });
        reject(new Error(error.message));
      };

      // Register event handlers
      socketService.on({
        onChatCreated: handleChatCreated,
        onError: handleError,
      });

      // Emit the start chat event
      socketService.startChatByEmail(payload);
    });
  }
}

export const apiService = new ApiService();
