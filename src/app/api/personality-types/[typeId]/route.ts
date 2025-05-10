import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PersonalityType from '@/models/PersonalityType';

// Chi tiết mặc định về các loại tính cách MBTI
const defaultPersonalityTypeDetails = {
  'INTJ': {
    id: 'INTJ',
    name: 'Architect',
    description: 'Imaginative and strategic thinkers, with a plan for everything.',
    strengths: ['Rational', 'Informed', 'Independent', 'Determined', 'Curious', 'Versatile'],
    weaknesses: ['Arrogant', 'Dismissive of emotions', 'Overly critical', 'Combative', 'Socially clueless'],
    careers: ['Scientist', 'Engineer', 'Professor', 'Medical Doctor', 'Corporate Strategist', 'Systems Analyst'],
    famousPeople: ['Elon Musk', 'Mark Zuckerberg', 'Christopher Nolan', 'Nikola Tesla', 'Friedrich Nietzsche']
  },
  'INTP': {
    id: 'INTP',
    name: 'Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
    weaknesses: ['Very private', 'Absent-minded', 'Insensitive', 'Indecisive', 'Procrastinating'],
    careers: ['Programmer', 'Financial Analyst', 'Architect', 'Economist', 'Research Scientist', 'Mathematician'],
    famousPeople: ['Albert Einstein', 'Bill Gates', 'Isaac Newton', 'Marie Curie', 'Immanuel Kant']
  },
  // Các loại tính cách khác sẽ được thêm vào đây
};

export async function GET(
  request: Request,
  { params }: { params: { typeId: string } }
) {
  try {
    const typeId = params.typeId.toUpperCase();
    
    await dbConnect();
    
    // Tìm loại tính cách trong database
    let personalityType = await PersonalityType.findOne({ id: typeId });
    
    // Nếu không tìm thấy và có dữ liệu mặc định, thêm vào database
    if (!personalityType && typeId in defaultPersonalityTypeDetails) {
      personalityType = await PersonalityType.create(defaultPersonalityTypeDetails[typeId as keyof typeof defaultPersonalityTypeDetails]);
    }
    
    // Nếu không tìm thấy, trả về lỗi 404
    if (!personalityType) {
      return NextResponse.json(
        { error: 'Personality type not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(personalityType);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personality type details' },
      { status: 500 }
    );
  }
} 