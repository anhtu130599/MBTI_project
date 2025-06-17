export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type ListResponse<T> = ApiResponse<PaginatedResponse<T>>;

export type CreateResponse<T> = ApiResponse<T>;

export type UpdateResponse<T> = ApiResponse<T>;

export type DeleteResponse = ApiResponse<{ id: string }>; 
