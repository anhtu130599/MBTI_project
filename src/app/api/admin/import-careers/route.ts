import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Career from '@/models/Career';
import { mbtiResults } from '@/data/results';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST() {
  try {
    // Xác thực admin
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (payload.payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    // Gộp nghề nghiệp từ mbtiResults
    const careerMap: { [key: string]: {
      title: string;
      description: string;
      personalityTypes: string[];
      skills: string[];
      education: string;
      salary: string;
    } } = {};
    for (const type in mbtiResults) {
      const result = mbtiResults[type];
      for (const careerTitle of result.careers) {
        if (!careerMap[careerTitle]) {
          careerMap[careerTitle] = {
            title: careerTitle,
            description: '',
            personalityTypes: [type],
            skills: [],
            education: '',
            salary: '',
          };
        } else {
          careerMap[careerTitle].personalityTypes.push(type);
        }
      }
    }
    // Xóa toàn bộ collection cũ
    await Career.deleteMany({});
    // Insert lại dữ liệu mới
    await Career.insertMany(Object.values(careerMap));
    return NextResponse.json({ message: 'Đã import xong danh sách nghề nghiệp từ results.ts vào database!' });
  } catch (error) {
    console.error('Error importing careers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 