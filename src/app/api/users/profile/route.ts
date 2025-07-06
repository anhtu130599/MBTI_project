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
    const User = (await import('@/core/infrastructure/database/models/User')).default;
    
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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (e) {
    const error = e as Error;
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

interface UpdateData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request);
    
    await dbConnect();
    const User = (await import('@/core/infrastructure/database/models/User')).default;
    
    const updateData: UpdateData = {};
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON data
      const jsonData = await request.json();
      if (jsonData.firstName) updateData.firstName = jsonData.firstName;
      if (jsonData.lastName) updateData.lastName = jsonData.lastName;
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const avatarFile = formData.get('avatar') as File | null;
      
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;

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
    } else {
      return NextResponse.json(
        { message: 'Content-Type must be application/json or multipart/form-data' },
        { status: 400 }
      );
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    const error = e as Error;
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
