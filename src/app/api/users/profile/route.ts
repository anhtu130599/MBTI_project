import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { jwtVerify } from 'jose';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload.payload.userId as string;
  } catch {
    throw new Error('Unauthorized');
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request);
    
    await dbConnect();
    const User = (await import('@/models/User')).default;
    
    const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpires');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request);
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const avatarFile = formData.get('avatar') as File | null;

    await dbConnect();
    const User = (await import('@/models/User')).default;
    
    const updateData: any = {};
    if (name) updateData.username = name; // Update username instead of name

    if (avatarFile) {
      try {
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${userId}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        
        // Ensure avatars directory exists
        const avatarsDir = join(process.cwd(), 'public', 'avatars');
        await mkdir(avatarsDir, { recursive: true });
        
        const path = join(avatarsDir, fileName);
        await writeFile(path, buffer);
        updateData.avatar = `/avatars/${fileName}`;
      } catch (fileError) {
        console.error('File upload error:', fileError);
        // Continue without avatar update if file upload fails
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password -verificationToken -verificationTokenExpires');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
