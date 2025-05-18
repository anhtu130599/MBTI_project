import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PersonalityType from '@/models/PersonalityType';

// Dữ liệu chuẩn hóa 16 loại MBTI tiếng Việt
const mbtiSeed = [
  {
    type: 'ISTJ',
    title: 'Người kiểm tra (Inspector)',
    description: 'ISTJ là những người thực tế, có trách nhiệm, trung thành và đáng tin cậy. Họ thích sự trật tự, tuân thủ quy tắc và truyền thống.',
    strengths: ['Trách nhiệm', 'Đáng tin cậy', 'Kiên trì', 'Tổ chức tốt', 'Tư duy logic'],
    weaknesses: ['Cứng nhắc', 'Khó thích nghi', 'Thiếu linh hoạt', 'Khó thể hiện cảm xúc'],
    careers: ['Kế toán', 'Lập trình viên', 'Luật sư', 'Cảnh sát', 'Bác sĩ', 'Thủ thư']
  },
  {
    type: 'ISFJ',
    title: 'Người che chở (Defender)',
    description: 'ISFJ là những người tận tâm, chu đáo, sống tình cảm và luôn sẵn sàng giúp đỡ người khác. Họ đề cao truyền thống và sự ổn định.',
    strengths: ['Tận tâm', 'Kiên nhẫn', 'Đáng tin cậy', 'Quan tâm người khác', 'Tỉ mỉ'],
    weaknesses: ['Ngại thay đổi', 'Dễ bị lợi dụng', 'Khó từ chối', 'Quá nhạy cảm'],
    careers: ['Y tá', 'Giáo viên', 'Nhân sự', 'Thủ thư', 'Công tác xã hội']
  },
  {
    type: 'INFJ',
    title: 'Người ủng hộ (Advocate)',
    description: 'INFJ là những người lý tưởng, sâu sắc, có trực giác mạnh và luôn hướng tới giá trị nhân văn. Họ thích giúp đỡ và truyền cảm hứng cho người khác.',
    strengths: ['Thấu cảm', 'Sáng tạo', 'Tận tâm', 'Trực giác tốt', 'Truyền cảm hứng'],
    weaknesses: ['Quá lý tưởng', 'Dễ thất vọng', 'Khó mở lòng', 'Nhạy cảm'],
    careers: ['Tư vấn tâm lý', 'Giáo viên', 'Nhà văn', 'Nhà hoạt động xã hội', 'Nghệ sĩ']
  },
  {
    type: 'INTJ',
    title: 'Nhà chiến lược (Architect)',
    description: 'INTJ là những người có tầm nhìn chiến lược, độc lập, quyết đoán và rất logic. Họ thích lập kế hoạch dài hạn và luôn tìm kiếm sự cải tiến.',
    strengths: ['Tư duy chiến lược', 'Phân tích logic', 'Độc lập', 'Quyết đoán'],
    weaknesses: ['Quá cầu toàn', 'Khó thể hiện cảm xúc', 'Cứng nhắc'],
    careers: ['Kiến trúc sư', 'Nhà khoa học', 'Chiến lược gia', 'Lập trình viên', 'Nhà nghiên cứu']
  },
  {
    type: 'ISTP',
    title: 'Thợ thủ công (Virtuoso)',
    description: 'ISTP là những người thực tế, linh hoạt, thích khám phá và giải quyết vấn đề bằng hành động. Họ thích tự do và không thích bị ràng buộc.',
    strengths: ['Linh hoạt', 'Giải quyết vấn đề tốt', 'Bình tĩnh', 'Thực tế'],
    weaknesses: ['Khó đoán', 'Dễ chán', 'Thiếu kiên nhẫn với lý thuyết'],
    careers: ['Kỹ sư', 'Thợ máy', 'Lập trình viên', 'Phi công', 'Vận động viên']
  },
  {
    type: 'ISFP',
    title: 'Người nghệ sĩ (Artist)',
    description: 'ISFP là những người sống tình cảm, sáng tạo, yêu nghệ thuật và thích trải nghiệm mới. Họ sống hướng nội nhưng rất thân thiện với người thân.',
    strengths: ['Sáng tạo', 'Nhạy cảm', 'Thích nghi tốt', 'Tận tâm'],
    weaknesses: ['Dễ bị tổn thương', 'Khó quyết đoán', 'Ngại xung đột'],
    careers: ['Nghệ sĩ', 'Nhà thiết kế', 'Nhiếp ảnh gia', 'Bác sĩ thú y', 'Nhạc sĩ']
  },
  {
    type: 'INFP',
    title: 'Người hòa giải (Mediator)',
    description: 'INFP là những người lý tưởng, sáng tạo, sống nội tâm và luôn hướng tới giá trị cá nhân. Họ thích giúp đỡ người khác và có trí tưởng tượng phong phú.',
    strengths: ['Sáng tạo', 'Thấu cảm', 'Lý tưởng', 'Trung thành'],
    weaknesses: ['Quá nhạy cảm', 'Dễ thất vọng', 'Thiếu thực tế'],
    careers: ['Nhà văn', 'Nhà thơ', 'Tư vấn tâm lý', 'Giáo viên', 'Nghệ sĩ']
  },
  {
    type: 'INTP',
    title: 'Nhà tư duy (Thinker)',
    description: 'INTP là những người phân tích, tò mò, thích khám phá ý tưởng mới và giải quyết vấn đề bằng logic. Họ độc lập và thích tự do sáng tạo.',
    strengths: ['Phân tích tốt', 'Sáng tạo', 'Độc lập', 'Tư duy logic'],
    weaknesses: ['Thiếu kiên nhẫn với chi tiết', 'Dễ chán', 'Khó thể hiện cảm xúc'],
    careers: ['Nhà nghiên cứu', 'Lập trình viên', 'Nhà khoa học', 'Giáo viên', 'Nhà phát minh']
  },
  {
    type: 'ESTP',
    title: 'Người sáng lập (Entrepreneur)',
    description: 'ESTP là những người năng động, thực tế, thích hành động và giải quyết vấn đề nhanh chóng. Họ thích thử thách và không ngại rủi ro.',
    strengths: ['Năng động', 'Thực tế', 'Quyết đoán', 'Thích thử thách'],
    weaknesses: ['Nóng vội', 'Thiếu kiên nhẫn', 'Dễ chán'],
    careers: ['Doanh nhân', 'Bán hàng', 'Cảnh sát', 'Vận động viên', 'Nhà đầu tư']
  },
  {
    type: 'ESFP',
    title: 'Người trình diễn (Entertainer)',
    description: 'ESFP là những người vui vẻ, hòa đồng, yêu thích nghệ thuật và thích sống trong hiện tại. Họ thích mang lại niềm vui cho người khác.',
    strengths: ['Hòa đồng', 'Nhiệt tình', 'Thích nghi tốt', 'Sáng tạo'],
    weaknesses: ['Dễ bị phân tâm', 'Thiếu kiên nhẫn', 'Dễ chán'],
    careers: ['Nghệ sĩ', 'Diễn viên', 'MC', 'Nhạc sĩ', 'Nhà tổ chức sự kiện']
  },
  {
    type: 'ENFP',
    title: 'Nhà vô địch (Campaigner)',
    description: 'ENFP là những người nhiệt huyết, sáng tạo, giàu trí tưởng tượng và luôn truyền cảm hứng cho người khác. Họ thích tự do và khám phá.',
    strengths: ['Sáng tạo', 'Nhiệt huyết', 'Truyền cảm hứng', 'Thấu cảm'],
    weaknesses: ['Dễ mất tập trung', 'Thiếu kiên nhẫn', 'Quá lý tưởng'],
    careers: ['Nhà báo', 'Nhà văn', 'Giáo viên', 'Nhà hoạt động xã hội', 'Nghệ sĩ']
  },
  {
    type: 'ENTP',
    title: 'Nhà phát minh (Inventor)',
    description: 'ENTP là những người sáng tạo, thích tranh luận, tò mò và luôn tìm kiếm ý tưởng mới. Họ thích thử thách trí tuệ và không ngại thay đổi.',
    strengths: ['Sáng tạo', 'Linh hoạt', 'Tư duy phản biện', 'Thích tranh luận'],
    weaknesses: ['Dễ chán', 'Thiếu kiên nhẫn với chi tiết', 'Thích tranh luận quá mức'],
    careers: ['Doanh nhân', 'Nhà phát minh', 'Luật sư', 'Nhà báo', 'Nhà tư vấn']
  },
  {
    type: 'ESTJ',
    title: 'Người giám sát (Supervisor)',
    description: 'ESTJ là những người thực tế, quyết đoán, có tổ chức và thích lãnh đạo. Họ đề cao truyền thống, kỷ luật và hiệu quả.',
    strengths: ['Tổ chức tốt', 'Quyết đoán', 'Trách nhiệm', 'Thực tế'],
    weaknesses: ['Cứng nhắc', 'Khó thích nghi', 'Quá nguyên tắc'],
    careers: ['Quản lý', 'Nhà điều hành', 'Cảnh sát', 'Quân nhân', 'Giáo viên']
  },
  {
    type: 'ESFJ',
    title: 'Nhà cung cấp (Provider)',
    description: 'ESFJ là những người thân thiện, tận tâm, thích giúp đỡ và chăm sóc người khác. Họ đề cao truyền thống và sự hòa hợp.',
    strengths: ['Thân thiện', 'Tận tâm', 'Tổ chức tốt', 'Quan tâm người khác'],
    weaknesses: ['Dễ bị ảnh hưởng', 'Khó từ chối', 'Quá nhạy cảm'],
    careers: ['Giáo viên', 'Y tá', 'Nhân sự', 'Tư vấn viên', 'Quản lý sự kiện']
  },
  {
    type: 'ENFJ',
    title: 'Giáo viên (Teacher)',
    description: 'ENFJ là những người truyền cảm hứng, giàu tình cảm, có khả năng lãnh đạo và luôn quan tâm đến người khác. Họ thích giúp đỡ và phát triển cộng đồng.',
    strengths: ['Truyền cảm hứng', 'Lãnh đạo', 'Thấu cảm', 'Tận tâm'],
    weaknesses: ['Quá lý tưởng', 'Dễ thất vọng', 'Khó từ chối'],
    careers: ['Giáo viên', 'Tư vấn viên', 'Nhà hoạt động xã hội', 'Quản lý', 'Nhà văn']
  },
  {
    type: 'ENTJ',
    title: 'Nguyên soái (Commander)',
    description: 'ENTJ là những người quyết đoán, có tầm nhìn, lãnh đạo tốt và luôn hướng tới mục tiêu. Họ thích lập kế hoạch và tổ chức công việc hiệu quả.',
    strengths: ['Lãnh đạo', 'Tư duy chiến lược', 'Quyết đoán', 'Tổ chức tốt'],
    weaknesses: ['Cứng nhắc', 'Khó thể hiện cảm xúc', 'Quá tham vọng'],
    careers: ['Giám đốc', 'Quản lý', 'Luật sư', 'Nhà hoạch định chiến lược', 'Doanh nhân']
  }
];

export async function GET() {
  try {
    await dbConnect();
    const types = await PersonalityType.find().sort({ type: 1 });
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error in GET /api/personality-types:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 