import { NextResponse } from 'next/server';

// Standard error codes
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  GONE = 'GONE',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Business logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // File handling
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  
  // Network
  TIMEOUT = 'TIMEOUT',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
}

// Success response interface
interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    version: string;
    [key: string]: unknown;
  };
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode | string;
    message: string;
    details?: unknown;
    field?: string;
    timestamp: string;
    traceId?: string;
  };
  message: string; // Duplicate for backward compatibility
}

// Pagination metadata
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated response interface
interface PaginatedResponse<T = unknown> extends SuccessResponse<T[]> {
  pagination: PaginationMeta;
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: string;
}

// API Response utility class
class ApiResponseUtil {
  private static version = '1.0.0';

  // Success responses
  static success<T>(
    data: T,
    message?: string,
    statusCode: number = 200,
    meta?: Record<string, unknown>
  ): NextResponse<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        version: this.version,
        ...meta,
      },
    };

    return NextResponse.json(response, { status: statusCode });
  }

  // Paginated success response
  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string,
    meta?: Record<string, unknown>
  ): NextResponse<PaginatedResponse<T>> {
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      message,
      pagination,
      meta: {
        timestamp: new Date().toISOString(),
        version: this.version,
        ...meta,
      },
    };

    return NextResponse.json(response, { status: 200 });
  }

  // Error responses
  static error(
    code: ErrorCode | string,
    message: string,
    statusCode: number = 500,
    details?: unknown,
    field?: string,
    traceId?: string
  ): NextResponse<ErrorResponse> {
    const response: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
        field,
        timestamp: new Date().toISOString(),
        traceId,
      },
      message, // Backward compatibility
    };

    return NextResponse.json(response, { status: statusCode });
  }

  // Specific error methods
  static badRequest(
    message: string = 'Bad Request',
    code: ErrorCode = ErrorCode.VALIDATION_ERROR,
    details?: unknown,
    field?: string
  ) {
    return this.error(code, message, 400, details, field);
  }

  static unauthorized(
    message: string = 'Unauthorized',
    code: ErrorCode = ErrorCode.UNAUTHORIZED
  ) {
    return this.error(code, message, 401);
  }

  static forbidden(
    message: string = 'Forbidden',
    code: ErrorCode = ErrorCode.FORBIDDEN
  ) {
    return this.error(code, message, 403);
  }

  static notFound(
    message: string = 'Not Found',
    code: ErrorCode = ErrorCode.NOT_FOUND
  ) {
    return this.error(code, message, 404);
  }

  static conflict(
    message: string = 'Conflict',
    code: ErrorCode = ErrorCode.CONFLICT,
    details?: unknown
  ) {
    return this.error(code, message, 409, details);
  }

  static validation(
    message: string = 'Validation Error',
    details?: unknown,
    field?: string
  ) {
    return this.error(ErrorCode.VALIDATION_ERROR, message, 422, details, field);
  }

  static tooManyRequests(
    message: string = 'Too Many Requests',
    retryAfter?: number
  ) {
    const response = this.error(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429);
    
    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString());
    }
    
    return response;
  }

  static internalServerError(
    message: string = 'Internal Server Error',
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: unknown,
    traceId?: string
  ) {
    return this.error(code, message, 500, details, undefined, traceId);
  }

  static serviceUnavailable(
    message: string = 'Service Unavailable',
    retryAfter?: number
  ) {
    const response = this.error(ErrorCode.SERVICE_UNAVAILABLE, message, 503);
    
    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString());
    }
    
    return response;
  }

  // Utility methods
  static created<T>(data: T, message?: string) {
    return this.success(data, message || 'Resource created successfully', 201);
  }

  static updated<T>(data: T, message?: string) {
    return this.success(data, message || 'Resource updated successfully', 200);
  }

  static deleted(message?: string) {
    return this.success(null, message || 'Resource deleted successfully', 200);
  }

  static noContent() {
    return new NextResponse(null, { status: 204 });
  }

  // Helper for creating pagination metadata
  static createPagination(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const pages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }

  // Helper for handling database errors
  static handleDatabaseError(error: MongoError, context?: string): NextResponse<ErrorResponse> {
    // Use monitoring system instead of console.error
    import('@/lib/monitoring').then(({ logger }) => {
      logger.error(`Database error ${context ? `in ${context}` : ''}`, error, 'Database');
    });

    // Handle common MongoDB/Mongoose errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return this.conflict(
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        ErrorCode.ALREADY_EXISTS,
        { field, value: error.keyValue?.[field] }
      );
    }

    if (error.name === 'ValidationError' && error.errors) {
      // Mongoose validation error
      const field = Object.keys(error.errors)[0];
      const message = error.errors[field]?.message || 'Validation failed';
      return this.validation(message, error.errors, field);
    }

    if (error.name === 'CastError' && error.path && error.value) {
      // Invalid ObjectId or type casting error
      return this.badRequest(
        'Invalid ID format',
        ErrorCode.INVALID_FORMAT,
        { field: error.path, value: error.value }
      );
    }

    // Generic database error
    return this.internalServerError(
      'Database operation failed',
      ErrorCode.DATABASE_ERROR,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }

  // Helper for handling async operations with error catching
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | NextResponse<ErrorResponse>> {
    try {
      return await operation();
    } catch (error: unknown) {
      // Use monitoring system instead of console.error
      import('@/lib/monitoring').then(({ errorMonitor }) => {
        errorMonitor.captureError({
          error: error as Error,
          context,
        });
      });
      
      const mongoError = error as MongoError;
      // Handle known error types
      if (mongoError.name === 'MongoError' || mongoError.name === 'ValidationError') {
        return this.handleDatabaseError(mongoError, context);
      }
      
      const httpError = error as { statusCode?: number; code?: ErrorCode; message: string; };
      // Handle custom app errors
      if (httpError.statusCode && httpError.code) {
        return this.error(httpError.code, httpError.message, httpError.statusCode);
      }
      
      // Generic error
      return this.internalServerError(
        'An unexpected error occurred',
        ErrorCode.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      );
    }
  }
}

export default ApiResponseUtil;

// Export types for use in other files
export type { SuccessResponse, ErrorResponse, PaginatedResponse, PaginationMeta }; 
