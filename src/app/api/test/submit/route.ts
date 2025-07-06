import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
// import { TestResult } from '@/models'; // Không dùng trong submit route
import QuestionModel from '@/models/Question'; // Import the correct Question model
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import mongoose from 'mongoose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DbQuestion {
  _id: mongoose.Types.ObjectId;
  text: string;
  options: { id: string; text: string; value: string }[];
  category: string;
}

// Hàm tính toán loại tính cách MBTI dựa trên câu trả lời
async function calculateMBTI(answers: Record<string, string>): Promise<{
  type: string;
  scores: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  percentages: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  total_questions: number;
}> {
  await dbConnect();
  const questions = await QuestionModel.find({}).lean() as unknown as DbQuestion[];
  
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  let matchedAnswers = 0;
  
  // Calculating MBTI from user answers

  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = questions.find(q => q._id.toString() === questionId);
    if (!question) continue;

    const option = question.options.find(opt => opt.id === optionId);
    if (!option || !option.value) continue;
    
    const trait = option.value as keyof typeof scores;
    if (trait in scores) {
      scores[trait]++;
      matchedAnswers++;
      // Matched answer for trait calculation
    }
  }
  
  // CRITICAL CHECK: If no answers were matched, something is wrong with the IDs.
  if (matchedAnswers === 0 && Object.keys(answers).length > 0) {
    console.error('FATAL: No answers could be matched to questions from the database. Check for ID mismatches.');
    // You might want to return an error response here in a real application
  }

  // Calculate percentages based on actual scores
  const totalQuestions = matchedAnswers;
  
  // Tính phần trăm cho mỗi cặp trait
  const percentages = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };
  
  // EI dimension
  const totalEI = scores.E + scores.I;
  if (totalEI > 0) {
    percentages.E = Math.round((scores.E / totalEI) * 100);
    percentages.I = Math.round((scores.I / totalEI) * 100);
  }
  
  // SN dimension  
  const totalSN = scores.S + scores.N;
  if (totalSN > 0) {
    percentages.S = Math.round((scores.S / totalSN) * 100);
    percentages.N = Math.round((scores.N / totalSN) * 100);
  }
  
  // TF dimension
  const totalTF = scores.T + scores.F;
  if (totalTF > 0) {
    percentages.T = Math.round((scores.T / totalTF) * 100);
    percentages.F = Math.round((scores.F / totalTF) * 100);
  }
  
  // JP dimension
  const totalJP = scores.J + scores.P;
  if (totalJP > 0) {
    percentages.J = Math.round((scores.J / totalJP) * 100);
    percentages.P = Math.round((scores.P / totalJP) * 100);
  }
  
  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N', 
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('');
  
  // MBTI type calculated successfully
  
  return { type, scores, percentages, total_questions: totalQuestions };
}

// Hàm lấy thông tin nghề nghiệp phù hợp từ database dựa trên loại tính cách
async function getCareerRecommendations(personalityType: string): Promise<string[]> {
  try {
    const Career = (await import('@/models/Career')).default;
    const careers = await Career.find({
      personalityTypes: { $in: [personalityType] }
    }).select('title').sort({ title: 1 }).limit(10);
    
    return careers.map(career => career.title);
  } catch (error) {
    console.error('Error fetching career recommendations from database:', error);
    // Fallback to static data if database query fails
    const fallbackCareers: Record<string, string[]> = {
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
    
    return fallbackCareers[personalityType] || ['Career information not available for this type'];
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Process test submission
    
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
        userId = payload.payload.id || payload.payload.userId;
        console.log('🔑 Found logged in user:', userId);
      } catch (_error) {
        console.log('🔑 Invalid token, continuing as guest');
        // Ignore invalid token, allow guest access
      }
    } else {
      console.log('🔑 No auth token found, user is guest');
    }
    
    // Lấy gợi ý nghề nghiệp từ database
    const careerRecommendations = await getCareerRecommendations(mbtiResult.type);
    
    // Trả về kết quả cho tất cả user (không lưu tự động)
    console.log('📤 Trả về kết quả test (không lưu tự động)');
    return NextResponse.json({
      success: true,
      personalityType: mbtiResult.type,
      type: mbtiResult.type, // Compatibility
      careerRecommendations,
      scores: mbtiResult.scores,
      percentages: mbtiResult.percentages,
      total_questions: mbtiResult.total_questions,
      timestamp: new Date(),
      isLoggedIn: !!userId // Báo cho frontend biết user đã login chưa
    });
    
  } catch (_error) {
    console.error('Error processing test submission:', _error);
    return NextResponse.json(
      { error: 'Failed to process test submission' },
      { status: 500 }
    );
  }
} 
