import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Update lastLogin safely
    try {
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    } catch (updateError) {
      console.warn('Could not update lastLogin:', updateError);
      // Continue anyway, login should still work
    }

    // Create JWT token using jose (same as /api/auth/me)
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // 7 days
    
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
    
    console.log('Creating JWT with payload:', tokenPayload);
    
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(new TextEncoder().encode(JWT_SECRET));

    console.log('JWT token created, length:', token.length);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    console.log('Setting auth-token cookie');
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('Login successful for user:', user.username, 'role:', user.role);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Login error:', error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
} 
