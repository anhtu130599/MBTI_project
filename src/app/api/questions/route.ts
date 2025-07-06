import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
 
export async function GET() {
  await dbConnect();
  const questions = await Question.find({}).lean();
  return NextResponse.json(questions);
} 
