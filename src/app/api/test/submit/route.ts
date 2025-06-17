import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestResult from '@/models/TestResult';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm tính toán loại tính cách MBTI dựa trên câu trả lời
function calculateMBTI(answers: Record<string, number>): {
  type: string;
  scores: {
    e: number;
    i: number;
    s: number;
    n: number;
    t: number;
    f: number;
    j: number;
    p: number;
  }
} {
  // Tính điểm cho từng thang đo
  let e = 0, i = 0; // Extraversion vs. Introversion
  let s = 0, n = 0; // Sensing vs. Intuition
  let t = 0, f = 0; // Thinking vs. Feeling
  let j = 0, p = 0; // Judging vs. Perceiving
  
  // Phân tích câu trả lời
  // Giả sử rằng câu hỏi được đánh số và phân loại theo thang đo tương ứng
  // Ví dụ: q1_e, q2_i, q3_s, q4_n, v.v.
  
  Object.entries(answers).forEach(([key, value]) => {
    if (key.includes('_e')) e += value;
    if (key.includes('_i')) i += value;
    if (key.includes('_s')) s += value;
    if (key.includes('_n')) n += value;
    if (key.includes('_t')) t += value;
    if (key.includes('_f')) f += value;
    if (key.includes('_j')) j += value;
    if (key.includes('_p')) p += value;
  });
  
  // Xác định loại tính cách
  const type = [
    e > i ? 'E' : 'I',
    s > n ? 'S' : 'N',
    t > f ? 'T' : 'F',
    j > p ? 'J' : 'P'
  ].join('');
  
  return {
    type,
    scores: { e, i, s, n, t, f, j, p }
  };
}

// Hàm lấy thông tin nghề nghiệp phù hợp dựa trên loại tính cách
function getCareerRecommendations(personalityType: string): string[] {
  const careerMap: Record<string, string[]> = {
    'INTJ': ['Systems Engineer', 'Software Developer', 'Business Analyst', 'Financial Advisor', 'Scientist'],
    'INTP': ['Software Developer', 'Data Scientist', 'Architect', 'Professor', 'Research Scientist'],
    'ENTJ': ['Executive', 'Entrepreneur', 'Lawyer', 'Management Consultant', 'Project Manager'],
    'ENTP': ['Entrepreneur', 'Creative Director', 'Lawyer', 'Marketing Strategist', 'Systems Analyst'],
    'INFJ': ['Counselor', 'HR Manager', 'Writer', 'Psychologist', 'Professor'],
    'INFP': ['Writer', 'Graphic Designer', 'Psychologist', 'Social Worker', 'HR Specialist'],
    'ENFJ': ['Teacher', 'HR Director', 'Marketing Manager', 'Public Relations Specialist', 'Non-profit Director'],
    'ENFP': ['Journalist', 'Advertising Creative', 'Consultant', 'Event Planner', 'Psychologist'],
    'ISTJ': ['Accountant', 'Auditor', 'Financial Analyst', 'Project Manager', 'Quality Assurance Specialist'],
    'ISFJ': ['Nurse', 'Elementary Teacher', 'Administrative Assistant', 'Social Worker', 'HR Specialist'],
    'ESTJ': ['Sales Manager', 'Project Manager', 'Business Administrator', 'Police Officer', 'Judge'],
    'ESFJ': ['Nurse', 'Teacher', 'Sales Representative', 'Event Coordinator', 'HR Specialist'],
    'ISTP': ['Engineer', 'Mechanic', 'Pilot', 'Forensic Scientist', 'Carpenter'],
    'ISFP': ['Artist', 'Designer', 'Veterinarian', 'Chef', 'Physical Therapist'],
    'ESTP': ['Sales Representative', 'Marketing Executive', 'Entrepreneur', 'Firefighter', 'Paramedic'],
    'ESFP': ['Event Planner', 'Travel Agent', 'Sales Representative', 'Performer', 'Child Care Provider']
  };
  
  return careerMap[personalityType] || ['Career information not available for this type'];
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Kiểm tra dữ liệu đầu vào
    if (!data.personalityType || typeof data.personalityType !== 'string') {
      return NextResponse.json(
        { error: 'Thiếu hoặc sai định dạng personalityType.' },
        { status: 400 }
      );
    }
    // Lấy userId từ JWT
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để lưu kết quả.' },
        { status: 401 }
      );
    }
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json(
        { error: 'Token không hợp lệ.' },
        { status: 401 }
      );
    }
    const userId = payload.payload.id;
    await dbConnect();
    // Lấy gợi ý nghề nghiệp
    const careerRecommendations = getCareerRecommendations(data.personalityType);
    // Tìm và cập nhật hoặc tạo mới kết quả cuối cùng
    const testResult = await TestResult.findOneAndUpdate(
      { userId },
      {
        personalityType: data.personalityType,
        userId,
        careerRecommendations
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({
      id: testResult._id,
      personalityType: testResult.personalityType,
      careerRecommendations: testResult.careerRecommendations,
      timestamp: testResult.createdAt
    });
  } catch (error) {
    console.error('Error processing test submission:', error);
    return NextResponse.json(
      { error: 'Failed to process test submission' },
      { status: 500 }
    );
  }
} 
