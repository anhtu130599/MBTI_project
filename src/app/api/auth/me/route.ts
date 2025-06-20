import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (jwtError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const User = (await import('@/models/User')).default;
    const user = await User.findById(payload.payload.userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const responseData = {
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Get user error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
