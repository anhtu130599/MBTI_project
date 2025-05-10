import { NextResponse } from 'next/server';

// Danh sách câu hỏi cho bài test MBTI
const questions = [
  {
    id: 'q1_e',
    text: 'Bạn thích tham gia các hoạt động xã hội và gặp gỡ nhiều người mới.',
    category: 'E-I'
  },
  {
    id: 'q2_i',
    text: 'Bạn thích dành thời gian một mình để suy nghĩ và tự tìm hiểu.',
    category: 'E-I'
  },
  {
    id: 'q3_e',
    text: 'Bạn thường chủ động bắt chuyện với người lạ.',
    category: 'E-I'
  },
  {
    id: 'q4_i',
    text: 'Bạn cảm thấy mệt mỏi sau khi tham gia các hoạt động xã hội đông người.',
    category: 'E-I'
  },
  {
    id: 'q5_s',
    text: 'Bạn thích tập trung vào các sự kiện và thông tin cụ thể hơn là các khái niệm trừu tượng.',
    category: 'S-N'
  },
  {
    id: 'q6_n',
    text: 'Bạn thường nghĩ về tương lai và các khả năng có thể xảy ra.',
    category: 'S-N'
  },
  {
    id: 'q7_s',
    text: 'Bạn tin tưởng vào kinh nghiệm và những gì bạn có thể quan sát được.',
    category: 'S-N'
  },
  {
    id: 'q8_n',
    text: 'Bạn thích khám phá các ý tưởng mới và sáng tạo.',
    category: 'S-N'
  },
  {
    id: 'q9_t',
    text: 'Khi đưa ra quyết định, bạn thường dựa vào logic và phân tích hơn là cảm xúc.',
    category: 'T-F'
  },
  {
    id: 'q10_f',
    text: 'Bạn thường đặt cảm xúc của người khác lên hàng đầu khi đưa ra quyết định.',
    category: 'T-F'
  },
  {
    id: 'q11_t',
    text: 'Bạn thích tranh luận và phân tích các vấn đề một cách khách quan.',
    category: 'T-F'
  },
  {
    id: 'q12_f',
    text: 'Bạn dễ bị ảnh hưởng bởi cảm xúc của người khác.',
    category: 'T-F'
  },
  {
    id: 'q13_j',
    text: 'Bạn thích lập kế hoạch chi tiết trước khi bắt đầu một dự án.',
    category: 'J-P'
  },
  {
    id: 'q14_p',
    text: 'Bạn thích giữ các lựa chọn mở và linh hoạt thay vì lên kế hoạch cụ thể.',
    category: 'J-P'
  },
  {
    id: 'q15_j',
    text: 'Bạn thích môi trường có cấu trúc và quy tắc rõ ràng.',
    category: 'J-P'
  },
  {
    id: 'q16_p',
    text: 'Bạn thường để mọi việc diễn ra tự nhiên và ứng biến theo tình huống.',
    category: 'J-P'
  },
  {
    id: 'q17_e',
    text: 'Bạn cảm thấy thoải mái khi là trung tâm của sự chú ý.',
    category: 'E-I'
  },
  {
    id: 'q18_i',
    text: 'Bạn thích suy nghĩ kỹ trước khi nói.',
    category: 'E-I'
  },
  {
    id: 'q19_s',
    text: 'Bạn thích tập trung vào chi tiết hơn là bức tranh tổng thể.',
    category: 'S-N'
  },
  {
    id: 'q20_n',
    text: 'Bạn thường nhìn thấy các mối liên hệ giữa các ý tưởng khác nhau.',
    category: 'S-N'
  }
];

export async function GET() {
  return NextResponse.json({
    questions,
    instructions: 'Đánh giá mức độ đồng ý của bạn với mỗi câu hỏi trên thang điểm từ 1 đến 5, trong đó 1 là hoàn toàn không đồng ý và 5 là hoàn toàn đồng ý.'
  });
} 