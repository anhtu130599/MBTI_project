import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestResult from '@/models/TestResult';
import Question from '@/models/Question';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm tính toán loại tính cách MBTI dựa trên câu trả lời
async function calculateMBTI(answers: Record<string, string>): Promise<{
  type: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  }
}> {
  // Tính điểm cho từng thang đo
  let E = 0, I = 0; // Extraversion vs. Introversion
  let S = 0, N = 0; // Sensing vs. Intuition
  let T = 0, F = 0; // Thinking vs. Feeling
  let J = 0, P = 0; // Judging vs. Perceiving
  
  console.log('🧮 Calculating MBTI from answers:', answers);
  
  // Lấy câu hỏi từ API (sử dụng dữ liệu static thay vì database)
  const questionsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/test/questions`);
  const questionsData = await questionsResponse.json();
  const questions = questionsData.questions;
  
  console.log('📝 Total questions loaded:', questions.length);
  
  // Phân tích câu trả lời
  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = questions.find((q: any) => q.id === questionId);
    if (!question) {
      console.log(`❌ Question not found: ${questionId}`);
      continue;
    }
    
    const option = question.options.find((opt: any) => opt.id === optionId);
    if (!option) {
      console.log(`❌ Option not found: ${optionId} for question ${questionId}`);
      continue;
    }
    
    const score = option.score || 0;
    const trait = option.trait;
    
    console.log(`✅ Q${questionId}: ${option.text} → ${trait}(${score})`);
    
    // Cộng điểm theo trait
    if (trait) {
      switch (trait) {
        case 'E': E += score; break;
        case 'I': I += score; break;
        case 'S': S += score; break;
        case 'N': N += score; break;
        case 'T': T += score; break;
        case 'F': F += score; break;
        case 'J': J += score; break;
        case 'P': P += score; break;
      }
    }
  }
  
  console.log('📊 Final scores:', { E, I, S, N, T, F, J, P });
  
  // Xác định loại tính cách (dominant trait wins)
  const type = [
    E > I ? 'E' : 'I',
    S > N ? 'S' : 'N', 
    T > F ? 'T' : 'F',
    J > P ? 'J' : 'P'
  ].join('');
  
  console.log('🎯 Calculated MBTI type:', type);
  
  return {
    type,
    scores: { E, I, S, N, T, F, J, P }
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
    if (!data.answers || typeof data.answers !== 'object') {
      return NextResponse.json(
        { error: 'Thiếu hoặc sai định dạng answers.' },
        { status: 400 }
      );
    }
    
    // Tính toán loại tính cách từ answers
    const mbtiResult = await calculateMBTI(data.answers);
    
    // Lấy userId từ JWT (optional, có thể để guest làm test)
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    let userId = null;
    
    if (token) {
      try {
        const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        userId = payload.payload.id;
      } catch {
        // Ignore invalid token, allow guest access
      }
    }
    
    // Lấy gợi ý nghề nghiệp
    const careerRecommendations = getCareerRecommendations(mbtiResult.type);
    
    if (userId) {
      // Lưu kết quả cho user đã đăng nhập
      await dbConnect();
      const testResult = await TestResult.findOneAndUpdate(
        { userId },
        {
          personalityType: mbtiResult.type,
          userId,
          careerRecommendations,
          scores: mbtiResult.scores
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      return NextResponse.json({
        id: testResult._id,
        personalityType: testResult.personalityType,
        type: testResult.personalityType, // Compatibility
        careerRecommendations: testResult.careerRecommendations,
        scores: mbtiResult.scores,
        timestamp: testResult.createdAt
      });
    } else {
      // Trả về kết quả cho guest user
      return NextResponse.json({
        personalityType: mbtiResult.type,
        type: mbtiResult.type, // Compatibility
        careerRecommendations,
        scores: mbtiResult.scores,
        timestamp: new Date()
      });
    }
    
  } catch (error) {
    console.error('Error processing test submission:', error);
    return NextResponse.json(
      { error: 'Failed to process test submission' },
      { status: 500 }
    );
  }
} 
