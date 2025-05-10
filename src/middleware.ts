import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Khóa bí mật cho JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Các route cần xác thực admin
const ADMIN_ROUTES = ['/admin', '/admin/users', '/admin/stats', '/admin/test-results'];

export async function middleware(request: NextRequest) {
  // Lấy token từ cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Nếu đang truy cập route admin
  if (ADMIN_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Xác thực token
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      
      // Kiểm tra quyền admin
      if (payload.role !== 'admin') {
        // Nếu không phải admin, chuyển hướng đến trang chủ
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Nếu là admin, cho phép truy cập
      return NextResponse.next();
    } catch (error) {
      // Nếu token không hợp lệ, chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Cho phép truy cập các route khác
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần xác thực
export const config = {
  matcher: ['/admin/:path*']
}; 