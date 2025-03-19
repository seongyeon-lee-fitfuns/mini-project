export interface AuthResponse {
  token?: string;
  error?: string;
}

export interface User {
  username: string;
  token: string;
} 