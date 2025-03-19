export interface ApiResponse {
  error?: any;
  data?: any;
}

export interface ApiLog {
  method: string;
  url: string;
  requestBody?: string;
  response: any;
  status: number;
  timestamp: number;
} 