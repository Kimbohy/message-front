// Get the current host and use it for API calls
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    // Use the same host as the frontend but port 3001 for API
    return `${protocol}//${hostname}:3001/api`;
  }
  // Fallback for SSR or other environments
  return "http://localhost:3001/api";
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface Chat {
  _id: string;
  type: "GROUP" | "PRIVATE";
  name?: string;
  participants: User[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
    updatedAt: string;
    seenBy?: string[]; // Array of user IDs who have seen the last message
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  seenBy?: string[]; // Array of user IDs who have seen the message
}

export interface CreateChatRequest {
  participants: string[];
  type: "GROUP" | "PRIVATE";
  name?: string;
}

export interface StartChatByEmailRequest {
  recipientEmail: string;
  initialMessage?: string;
}

export interface StartChatByEmailResponse {
  success: boolean;
  chat: {
    _id: string;
    type: "GROUP" | "PRIVATE";
    participants: string[];
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

class ApiService {
  private baseUrl = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  getToken() {
    return this.token;
  }

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
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  async register(
    userData: RegisterRequest
  ): Promise<{ message: string; user: User }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return response;
  }

  async getProfile(): Promise<User> {
    return this.request<User>("/auth/profile");
  }

  // Chat endpoints
  async getChats(): Promise<Chat[]> {
    return this.request<Chat[]>("/chat");
  }

  async createChat(chatData: CreateChatRequest): Promise<any> {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify(chatData),
    });
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.request<Message[]>(`/chat/${chatId}/messages`);
  }

  async startChatByEmail(
    data: StartChatByEmailRequest
  ): Promise<StartChatByEmailResponse> {
    return this.request<StartChatByEmailResponse>("/chat/start-by-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
