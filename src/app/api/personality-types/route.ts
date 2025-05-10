import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PersonalityType from '@/models/PersonalityType';

// Danh sách 16 loại tính cách MBTI
const personalityTypes = [
  {
    id: 'INTJ',
    name: 'Architect',
    description: 'Imaginative and strategic thinkers, with a plan for everything.'
  },
  {
    id: 'INTP',
    name: 'Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.'
  },
  {
    id: 'ENTJ',
    name: 'Commander',
    description: 'Bold, imaginative and strong-willed leaders, always finding a way – or making one.'
  },
  {
    id: 'ENTP',
    name: 'Debater',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.'
  },
  {
    id: 'INFJ',
    name: 'Advocate',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists.'
  },
  {
    id: 'INFP',
    name: 'Mediator',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.'
  },
  {
    id: 'ENFJ',
    name: 'Protagonist',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.'
  },
  {
    id: 'ENFP',
    name: 'Campaigner',
    description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.'
  },
  {
    id: 'ISTJ',
    name: 'Logistician',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.'
  },
  {
    id: 'ISFJ',
    name: 'Defender',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.'
  },
  {
    id: 'ESTJ',
    name: 'Executive',
    description: 'Excellent administrators, unsurpassed at managing things – or people.'
  },
  {
    id: 'ESFJ',
    name: 'Consul',
    description: 'Extraordinarily caring, social and popular people, always eager to help.'
  },
  {
    id: 'ISTP',
    name: 'Virtuoso',
    description: 'Bold and practical experimenters, masters of all kinds of tools.'
  },
  {
    id: 'ISFP',
    name: 'Adventurer',
    description: 'Flexible and charming artists, always ready to explore and experience something new.'
  },
  {
    id: 'ESTP',
    name: 'Entrepreneur',
    description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.'
  },
  {
    id: 'ESFP',
    name: 'Entertainer',
    description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.'
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Kiểm tra xem đã có dữ liệu trong database chưa
    const count = await PersonalityType.countDocuments();
    
    // Nếu chưa có dữ liệu, thêm dữ liệu mặc định
    if (count === 0) {
      await PersonalityType.insertMany(personalityTypes);
    }
    
    // Lấy tất cả loại tính cách từ database
    const personalityTypesFromDB = await PersonalityType.find({}, 'id name description');
    
    return NextResponse.json(personalityTypesFromDB);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personality types' },
      { status: 500 }
    );
  }
} 