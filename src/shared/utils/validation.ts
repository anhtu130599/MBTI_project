import { NextRequest } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';
import ApiResponseUtil, { ErrorCode } from './apiResponse';

// Common validation schemas
export const commonSchemas = {
  // MongoDB ObjectId
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  
  // Search & filtering
  search: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    tags: z.string().optional(), // Comma-separated tags
  }),
};



// User validation schemas
export const userSchemas = {
  // Login
  login: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  
  // Register
  register: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username too long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password too long'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    email: z.string().email('Invalid email format').optional(),
  }),
  
  // Update profile
  updateProfile: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    email: z.string().email('Invalid email format').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    bio: z.string().max(500, 'Bio too long').optional(),
  }),
};

// Career validation schemas
export const careerSchemas = {
  // Create career
  create: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().min(1, 'Description is required'),
    personalityTypes: z.array(z.string()).min(1, 'At least one personality type required'),
    requirements: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    salary: z.object({
      min: z.number().min(0, 'Minimum salary must be positive').optional(),
      max: z.number().min(0, 'Maximum salary must be positive').optional(),
      currency: z.string().default('VND'),
    }).optional(),
    workEnvironment: z.array(z.string()).default([]),
    careerPath: z.array(z.string()).default([]),
    companies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
  
  // Update career
  update: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    personalityTypes: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    salary: z.object({
      min: z.number().min(0, 'Minimum salary must be positive').optional(),
      max: z.number().min(0, 'Maximum salary must be positive').optional(),
      currency: z.string().optional(),
    }).optional(),
    workEnvironment: z.array(z.string()).optional(),
    careerPath: z.array(z.string()).optional(),
    companies: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
};

// Validation middleware function
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (request: NextRequest): Promise<{ success: true; data: T } | { success: false; response: Response }> => {
    try {
      let data: unknown;
      
      // Get data based on request method
      if (request.method === 'GET' || request.method === 'DELETE') {
        // Parse query parameters
        const url = new URL(request.url);
        const queryParams: Record<string, string | string[]> = {};
        
        url.searchParams.forEach((value, key) => {
          // Handle array parameters (comma-separated)
          if ((key === 'tags' || key === 'personalityTypes') && value) {
            queryParams[key] = value.split(',').map(item => item.trim()).filter(Boolean);
          } else {
            queryParams[key] = value;
          }
        });
        
        data = queryParams;
      } else {
        // Parse request body
        try {
          data = await request.json();
        } catch (_error) {
          return {
            success: false,
            response: ApiResponseUtil.badRequest(
              'Invalid JSON in request body',
              ErrorCode.INVALID_FORMAT
            ),
          };
        }
      }
      
      // Validate data against schema
      const validatedData = schema.parse(data);
      
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        const firstError = errors[0];
        
        return {
          success: false,
          response: ApiResponseUtil.validation(
            firstError.message,
            { errors },
            firstError.field
          ),
        };
      }
      
      // Handle other errors
      return {
        success: false,
        response: ApiResponseUtil.badRequest(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          error
        ),
      };
    }
  };
}

// Helper function to validate path parameters
export function validatePathParams(params: Record<string, string>, schema: ZodSchema) {
  try {
    return { success: true, data: schema.parse(params) };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        response: ApiResponseUtil.badRequest(
          firstError.message,
          ErrorCode.INVALID_FORMAT,
          { field: firstError.path.join('.') },
          firstError.path.join('.')
        ),
      };
    }
    
    return {
      success: false,
      response: ApiResponseUtil.badRequest(
        'Invalid path parameters',
        ErrorCode.VALIDATION_ERROR
      ),
    };
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest, requiredRole?: string) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return {
      success: false,
      response: ApiResponseUtil.unauthorized('Authentication required'),
    };
  }
  
  try {
    const { verifyToken } = await import('@/lib/jwt');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        success: false,
        response: ApiResponseUtil.unauthorized('Invalid token'),
      };
    }
    
    if (requiredRole && decoded.role !== requiredRole) {
      return {
        success: false,
        response: ApiResponseUtil.forbidden(`${requiredRole} access required`),
      };
    }
    
    return { success: true, user: decoded as { id: string; role: string; iat: number; exp: number } };
  } catch (_error) {
    return {
      success: false,
      response: ApiResponseUtil.unauthorized('Token verification failed'),
    };
  }
}

// Rate limiting middleware (basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    const key = `${ip}:${Math.floor(now / windowMs)}`;
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (current.count >= maxRequests) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      return {
        success: false,
        response: ApiResponseUtil.tooManyRequests(
          'Too many requests, please try again later',
          retryAfter
        ),
      };
    }
    
    current.count++;
    rateLimitStore.set(key, current);
    
    // Cleanup old entries
    if (rateLimitStore.size > 1000) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k);
        }
      }
    }
    
    return { success: true };
  };
}

// Content-Type validation
export function validateContentType(allowedTypes: string[] = ['application/json']) {
  return (request: NextRequest) => {
    if (request.method === 'GET' || request.method === 'DELETE') {
      return { success: true };
    }
    
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return {
        success: false,
        response: ApiResponseUtil.badRequest(
          `Invalid content type. Expected: ${allowedTypes.join(', ')}`,
          ErrorCode.INVALID_FORMAT
        ),
      };
    }
    
    return { success: true };
  };
} 
