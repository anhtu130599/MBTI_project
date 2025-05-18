import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
  await dbConnect();
  const questions = await Question.find({ isActive: true }).sort({ order: 1 });
  return NextResponse.json(questions);
} 