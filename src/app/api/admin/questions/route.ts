import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function isAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return false;
  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload.payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  await dbConnect();
  const questions = await Question.find().sort({ order: 1 });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const maxOrder = (await Question.findOne().sort({ order: -1 }))?.order || 0;
  const question = await Question.create({ ...data, order: maxOrder + 1 });
  return NextResponse.json(question);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const data = await req.json();
  const { _id, ...update } = data;
  const question = await Question.findByIdAndUpdate(_id, update, { new: true });
  return NextResponse.json(question);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { _id } = await req.json();
  await Question.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
} 
