/**
 * User Types
 */

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthUser extends User {
  accessToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}
