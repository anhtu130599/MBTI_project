import { NextResponse } from 'next/server';

// Danh sách câu hỏi cho bài test MBTI với options đầy đủ
const questions = [
  {
    id: 'q1',
    text: 'Bạn thích tham gia các hoạt động xã hội và gặp gỡ nhiều người mới.',
    category: 'EI',
    options: [
      { id: 'q1_1', text: 'Hoàn toàn đồng ý', trait: 'E', score: 5 },
      { id: 'q1_2', text: 'Đồng ý', trait: 'E', score: 3 },
      { id: 'q1_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q1_4', text: 'Không đồng ý', trait: 'I', score: 3 },
      { id: 'q1_5', text: 'Hoàn toàn không đồng ý', trait: 'I', score: 5 }
    ]
  },
  {
    id: 'q2',
    text: 'Bạn thích dành thời gian một mình để suy nghĩ và tự tìm hiểu.',
    category: 'EI',
    options: [
      { id: 'q2_1', text: 'Hoàn toàn đồng ý', trait: 'I', score: 5 },
      { id: 'q2_2', text: 'Đồng ý', trait: 'I', score: 3 },
      { id: 'q2_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q2_4', text: 'Không đồng ý', trait: 'E', score: 3 },
      { id: 'q2_5', text: 'Hoàn toàn không đồng ý', trait: 'E', score: 5 }
    ]
  },
  {
    id: 'q3',
    text: 'Bạn thích tập trung vào các sự kiện và thông tin cụ thể hơn là các khái niệm trừu tượng.',
    category: 'SN',
    options: [
      { id: 'q3_1', text: 'Hoàn toàn đồng ý', trait: 'S', score: 5 },
      { id: 'q3_2', text: 'Đồng ý', trait: 'S', score: 3 },
      { id: 'q3_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q3_4', text: 'Không đồng ý', trait: 'N', score: 3 },
      { id: 'q3_5', text: 'Hoàn toàn không đồng ý', trait: 'N', score: 5 }
    ]
  },
  {
    id: 'q4',
    text: 'Bạn thường nghĩ về tương lai và các khả năng có thể xảy ra.',
    category: 'SN',
    options: [
      { id: 'q4_1', text: 'Hoàn toàn đồng ý', trait: 'N', score: 5 },
      { id: 'q4_2', text: 'Đồng ý', trait: 'N', score: 3 },
      { id: 'q4_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q4_4', text: 'Không đồng ý', trait: 'S', score: 3 },
      { id: 'q4_5', text: 'Hoàn toàn không đồng ý', trait: 'S', score: 5 }
    ]
  },
  {
    id: 'q5',
    text: 'Khi đưa ra quyết định, bạn thường dựa vào logic và phân tích hơn là cảm xúc.',
    category: 'TF',
    options: [
      { id: 'q5_1', text: 'Hoàn toàn đồng ý', trait: 'T', score: 5 },
      { id: 'q5_2', text: 'Đồng ý', trait: 'T', score: 3 },
      { id: 'q5_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q5_4', text: 'Không đồng ý', trait: 'F', score: 3 },
      { id: 'q5_5', text: 'Hoàn toàn không đồng ý', trait: 'F', score: 5 }
    ]
  },
  {
    id: 'q6',
    text: 'Bạn thường đặt cảm xúc của người khác lên hàng đầu khi đưa ra quyết định.',
    category: 'TF',
    options: [
      { id: 'q6_1', text: 'Hoàn toàn đồng ý', trait: 'F', score: 5 },
      { id: 'q6_2', text: 'Đồng ý', trait: 'F', score: 3 },
      { id: 'q6_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q6_4', text: 'Không đồng ý', trait: 'T', score: 3 },
      { id: 'q6_5', text: 'Hoàn toàn không đồng ý', trait: 'T', score: 5 }
    ]
  },
  {
    id: 'q7',
    text: 'Bạn thích lập kế hoạch chi tiết trước khi bắt đầu một dự án.',
    category: 'JP',
    options: [
      { id: 'q7_1', text: 'Hoàn toàn đồng ý', trait: 'J', score: 5 },
      { id: 'q7_2', text: 'Đồng ý', trait: 'J', score: 3 },
      { id: 'q7_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q7_4', text: 'Không đồng ý', trait: 'P', score: 3 },
      { id: 'q7_5', text: 'Hoàn toàn không đồng ý', trait: 'P', score: 5 }
    ]
  },
  {
    id: 'q8',
    text: 'Bạn thích giữ các lựa chọn mở và linh hoạt thay vì lên kế hoạch cụ thể.',
    category: 'JP',
    options: [
      { id: 'q8_1', text: 'Hoàn toàn đồng ý', trait: 'P', score: 5 },
      { id: 'q8_2', text: 'Đồng ý', trait: 'P', score: 3 },
      { id: 'q8_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q8_4', text: 'Không đồng ý', trait: 'J', score: 3 },
      { id: 'q8_5', text: 'Hoàn toàn không đồng ý', trait: 'J', score: 5 }
    ]
  },
  {
    id: 'q9',
    text: 'Bạn thường chủ động bắt chuyện với người lạ.',
    category: 'EI',
    options: [
      { id: 'q9_1', text: 'Hoàn toàn đồng ý', trait: 'E', score: 5 },
      { id: 'q9_2', text: 'Đồng ý', trait: 'E', score: 3 },
      { id: 'q9_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q9_4', text: 'Không đồng ý', trait: 'I', score: 3 },
      { id: 'q9_5', text: 'Hoàn toàn không đồng ý', trait: 'I', score: 5 }
    ]
  },
  {
    id: 'q10',
    text: 'Bạn tin tưởng vào kinh nghiệm và những gì bạn có thể quan sát được.',
    category: 'SN',
    options: [
      { id: 'q10_1', text: 'Hoàn toàn đồng ý', trait: 'S', score: 5 },
      { id: 'q10_2', text: 'Đồng ý', trait: 'S', score: 3 },
      { id: 'q10_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q10_4', text: 'Không đồng ý', trait: 'N', score: 3 },
      { id: 'q10_5', text: 'Hoàn toàn không đồng ý', trait: 'N', score: 5 }
    ]
  },
  {
    id: 'q11',
    text: 'Bạn thích khám phá các ý tưởng mới và sáng tạo.',
    category: 'SN',
    options: [
      { id: 'q11_1', text: 'Hoàn toàn đồng ý', trait: 'N', score: 5 },
      { id: 'q11_2', text: 'Đồng ý', trait: 'N', score: 3 },
      { id: 'q11_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q11_4', text: 'Không đồng ý', trait: 'S', score: 3 },
      { id: 'q11_5', text: 'Hoàn toàn không đồng ý', trait: 'S', score: 5 }
    ]
  },
  {
    id: 'q12',
    text: 'Bạn thích tranh luận và phân tích các vấn đề một cách khách quan.',
    category: 'TF',
    options: [
      { id: 'q12_1', text: 'Hoàn toàn đồng ý', trait: 'T', score: 5 },
      { id: 'q12_2', text: 'Đồng ý', trait: 'T', score: 3 },
      { id: 'q12_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q12_4', text: 'Không đồng ý', trait: 'F', score: 3 },
      { id: 'q12_5', text: 'Hoàn toàn không đồng ý', trait: 'F', score: 5 }
    ]
  },
  {
    id: 'q13',
    text: 'Bạn dễ bị ảnh hưởng bởi cảm xúc của người khác.',
    category: 'TF',
    options: [
      { id: 'q13_1', text: 'Hoàn toàn đồng ý', trait: 'F', score: 5 },
      { id: 'q13_2', text: 'Đồng ý', trait: 'F', score: 3 },
      { id: 'q13_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q13_4', text: 'Không đồng ý', trait: 'T', score: 3 },
      { id: 'q13_5', text: 'Hoàn toàn không đồng ý', trait: 'T', score: 5 }
    ]
  },
  {
    id: 'q14',
    text: 'Bạn thích môi trường có cấu trúc và quy tắc rõ ràng.',
    category: 'JP',
    options: [
      { id: 'q14_1', text: 'Hoàn toàn đồng ý', trait: 'J', score: 5 },
      { id: 'q14_2', text: 'Đồng ý', trait: 'J', score: 3 },
      { id: 'q14_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q14_4', text: 'Không đồng ý', trait: 'P', score: 3 },
      { id: 'q14_5', text: 'Hoàn toàn không đồng ý', trait: 'P', score: 5 }
    ]
  },
  {
    id: 'q15',
    text: 'Bạn thường để mọi việc diễn ra tự nhiên và ứng biến theo tình huống.',
    category: 'JP',
    options: [
      { id: 'q15_1', text: 'Hoàn toàn đồng ý', trait: 'P', score: 5 },
      { id: 'q15_2', text: 'Đồng ý', trait: 'P', score: 3 },
      { id: 'q15_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q15_4', text: 'Không đồng ý', trait: 'J', score: 3 },
      { id: 'q15_5', text: 'Hoàn toàn không đồng ý', trait: 'J', score: 5 }
    ]
  },
  {
    id: 'q16',
    text: 'Bạn cảm thấy thoải mái khi là trung tâm của sự chú ý.',
    category: 'EI',
    options: [
      { id: 'q16_1', text: 'Hoàn toàn đồng ý', trait: 'E', score: 5 },
      { id: 'q16_2', text: 'Đồng ý', trait: 'E', score: 3 },
      { id: 'q16_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q16_4', text: 'Không đồng ý', trait: 'I', score: 3 },
      { id: 'q16_5', text: 'Hoàn toàn không đồng ý', trait: 'I', score: 5 }
    ]
  },
  {
    id: 'q17',
    text: 'Bạn thích suy nghĩ kỹ trước khi nói.',
    category: 'EI',
    options: [
      { id: 'q17_1', text: 'Hoàn toàn đồng ý', trait: 'I', score: 5 },
      { id: 'q17_2', text: 'Đồng ý', trait: 'I', score: 3 },
      { id: 'q17_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q17_4', text: 'Không đồng ý', trait: 'E', score: 3 },
      { id: 'q17_5', text: 'Hoàn toàn không đồng ý', trait: 'E', score: 5 }
    ]
  },
  {
    id: 'q18',
    text: 'Bạn thích tập trung vào chi tiết hơn là bức tranh tổng thể.',
    category: 'SN',
    options: [
      { id: 'q18_1', text: 'Hoàn toàn đồng ý', trait: 'S', score: 5 },
      { id: 'q18_2', text: 'Đồng ý', trait: 'S', score: 3 },
      { id: 'q18_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q18_4', text: 'Không đồng ý', trait: 'N', score: 3 },
      { id: 'q18_5', text: 'Hoàn toàn không đồng ý', trait: 'N', score: 5 }
    ]
  },
  {
    id: 'q19',
    text: 'Bạn thường nhìn thấy các mối liên hệ giữa các ý tưởng khác nhau.',
    category: 'SN',
    options: [
      { id: 'q19_1', text: 'Hoàn toàn đồng ý', trait: 'N', score: 5 },
      { id: 'q19_2', text: 'Đồng ý', trait: 'N', score: 3 },
      { id: 'q19_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q19_4', text: 'Không đồng ý', trait: 'S', score: 3 },
      { id: 'q19_5', text: 'Hoàn toàn không đồng ý', trait: 'S', score: 5 }
    ]
  },
  {
    id: 'q20',
    text: 'Bạn cảm thấy mệt mỏi sau khi tham gia các hoạt động xã hội đông người.',
    category: 'EI',
    options: [
      { id: 'q20_1', text: 'Hoàn toàn đồng ý', trait: 'I', score: 5 },
      { id: 'q20_2', text: 'Đồng ý', trait: 'I', score: 3 },
      { id: 'q20_3', text: 'Trung lập', trait: null, score: 0 },
      { id: 'q20_4', text: 'Không đồng ý', trait: 'E', score: 3 },
      { id: 'q20_5', text: 'Hoàn toàn không đồng ý', trait: 'E', score: 5 }
    ]
  }
];

export async function GET() {
  return NextResponse.json({
    questions,
    instructions: 'Hãy chọn mức độ đồng ý phù hợp nhất với bạn cho mỗi câu hỏi. Không có câu trả lời đúng hay sai, hãy chọn theo cảm nhận thật nhất của bạn.'
  });
} 
