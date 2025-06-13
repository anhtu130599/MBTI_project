export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

export interface ListResponse<T> extends ApiResponse<PaginatedResponse<T>> {}

export interface CreateResponse<T> extends ApiResponse<T> {}

export interface UpdateResponse<T> extends ApiResponse<T> {}

export interface DeleteResponse extends ApiResponse<{ id: string }> {} 
