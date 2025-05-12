import { Question } from '@/types/mbti';

// Nhóm E/I - Hướng ngoại/Hướng nội
const eiQuestions: Question[] = [
  {
    id: 'ei-1',
    category: 'EI',
    text: 'Bạn thường cảm thấy thoải mái hơn khi:',
    options: [
      { value: 'E', text: 'Ở trong một nhóm người và tương tác với nhiều người' },
      { value: 'I', text: 'Ở một mình hoặc với một vài người bạn thân' }
    ]
  },
  {
    id: 'ei-2',
    category: 'EI',
    text: 'Sau một ngày bận rộn, bạn thường:',
    options: [
      { value: 'E', text: 'Tìm kiếm cơ hội để gặp gỡ bạn bè và chia sẻ trải nghiệm' },
      { value: 'I', text: 'Dành thời gian một mình để nghỉ ngơi và nạp năng lượng' }
    ]
  },
  {
    id: 'ei-3',
    category: 'EI',
    text: 'Trong các cuộc họp nhóm, bạn thường:',
    options: [
      { value: 'E', text: 'Chủ động phát biểu và chia sẻ ý kiến' },
      { value: 'I', text: 'Lắng nghe và suy nghĩ kỹ trước khi nói' }
    ]
  }
];

// Nhóm S/N - Giác quan/Trực giác
const snQuestions: Question[] = [
  {
    id: 'sn-1',
    category: 'SN',
    text: 'Khi giải quyết vấn đề, bạn thường:',
    options: [
      { value: 'S', text: 'Tập trung vào các chi tiết và dữ liệu thực tế' },
      { value: 'N', text: 'Tìm kiếm các mẫu hình và khả năng tiềm ẩn' }
    ]
  },
  {
    id: 'sn-2',
    category: 'SN',
    text: 'Bạn thích làm việc với:',
    options: [
      { value: 'S', text: 'Các thông tin cụ thể và thực tế' },
      { value: 'N', text: 'Các ý tưởng và khả năng mới' }
    ]
  },
  {
    id: 'sn-3',
    category: 'SN',
    text: 'Trong các cuộc trò chuyện, bạn thường:',
    options: [
      { value: 'S', text: 'Tập trung vào những gì đang xảy ra hiện tại' },
      { value: 'N', text: 'Thảo luận về các khả năng và ý tưởng mới' }
    ]
  }
];

// Nhóm T/F - Lý trí/Cảm xúc
const tfQuestions: Question[] = [
  {
    id: 'tf-1',
    category: 'TF',
    text: 'Khi đưa ra quyết định quan trọng, bạn thường:',
    options: [
      { value: 'T', text: 'Dựa trên logic và phân tích khách quan' },
      { value: 'F', text: 'Xem xét cảm xúc và tác động đến người khác' }
    ]
  },
  {
    id: 'tf-2',
    category: 'TF',
    text: 'Trong các cuộc tranh luận, bạn thường:',
    options: [
      { value: 'T', text: 'Tập trung vào tính đúng sai của vấn đề' },
      { value: 'F', text: 'Chú ý đến cảm xúc và mối quan hệ' }
    ]
  },
  {
    id: 'tf-3',
    category: 'TF',
    text: 'Bạn đánh giá người khác dựa trên:',
    options: [
      { value: 'T', text: 'Năng lực và kết quả công việc' },
      { value: 'F', text: 'Tính cách và mối quan hệ' }
    ]
  }
];

// Nhóm J/P - Nguyên tắc/Linh hoạt
const jpQuestions: Question[] = [
  {
    id: 'jp-1',
    category: 'JP',
    text: 'Bạn thích làm việc trong môi trường:',
    options: [
      { value: 'J', text: 'Có kế hoạch rõ ràng và cấu trúc cụ thể' },
      { value: 'P', text: 'Linh hoạt và cho phép thay đổi' }
    ]
  },
  {
    id: 'jp-2',
    category: 'JP',
    text: 'Khi đối mặt với deadline, bạn thường:',
    options: [
      { value: 'J', text: 'Hoàn thành công việc trước thời hạn' },
      { value: 'P', text: 'Làm việc tốt nhất dưới áp lực thời gian' }
    ]
  },
  {
    id: 'jp-3',
    category: 'JP',
    text: 'Trong cuộc sống hàng ngày, bạn thường:',
    options: [
      { value: 'J', text: 'Lên kế hoạch chi tiết và tuân thủ theo đó' },
      { value: 'P', text: 'Giữ mọi thứ linh hoạt và tùy cơ ứng biến' }
    ]
  }
];

// Kết hợp tất cả câu hỏi
export const questions: Question[] = [
  ...eiQuestions,
  ...snQuestions,
  ...tfQuestions,
  ...jpQuestions
];

// Export các nhóm câu hỏi riêng biệt để sử dụng trong testConfig
export const questionGroups = {
  ei: eiQuestions,
  sn: snQuestions,
  tf: tfQuestions,
  jp: jpQuestions
}; 