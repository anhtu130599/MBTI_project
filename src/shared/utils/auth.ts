import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserJWTPayload {
  userId: string;
  username: string;
  role: string;
}

export const getAuthHeaders = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

// Helper function to verify admin authentication
export async function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    console.log('verifyAdminAuth: No token found');
    return { success: false, error: 'Unauthorized', status: 401 };
  }

  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userData = payload.payload as unknown as UserJWTPayload;
    
    if (!userData.userId) {
      console.log('verifyAdminAuth: No userId in payload');
      return { success: false, error: 'Invalid token', status: 401 };
    }

    if (userData.role !== 'admin') {
      console.log('verifyAdminAuth: User role is not admin:', userData.role);
      return { success: false, error: 'Forbidden - Admin access required', status: 403 };
    }

    return { 
      success: true, 
      userId: userData.userId,
      username: userData.username,
      role: userData.role 
    };
  } catch (error) {
    console.log('verifyAdminAuth: JWT verification failed:', error instanceof Error ? error.message : error);
    return { success: false, error: 'Invalid token', status: 401 };
  }
}

// Helper function to verify user authentication (non-admin)
export async function verifyUserAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  console.log('verifyUserAuth: token exists:', !!token);
  
  if (!token) {
    return { success: false, error: 'Unauthorized', status: 401 };
  }

  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userData = payload.payload as unknown as UserJWTPayload;
    
    if (!userData.userId) {
      return { success: false, error: 'Invalid token', status: 401 };
    }

    return { 
      success: true, 
      userId: userData.userId,
      username: userData.username,
      role: userData.role 
    };
  } catch {
    return { success: false, error: 'Invalid token', status: 401 };
  }
} 