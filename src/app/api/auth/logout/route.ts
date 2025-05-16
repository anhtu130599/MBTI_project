import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: false, // Để false khi phát triển trên localhost
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });
  return response;
} 