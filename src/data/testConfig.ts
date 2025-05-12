import { TestConfig } from '@/types/mbti';
import { questionGroups } from './questions';

export const testConfig: TestConfig = {
  introduction: {
    title: 'Bài kiểm tra tính cách MBTI',
    description: 'Bài kiểm tra này sẽ giúp bạn khám phá loại tính cách MBTI của mình thông qua việc trả lời các câu hỏi về cách bạn suy nghĩ và hành động trong các tình huống khác nhau.',
    duration: '15-20 phút',
    totalQuestions: 12
  },
  groups: [
    {
      category: 'EI',
      title: 'Hướng ngoại (E) - Hướng nội (I)',
      description: 'Nhóm câu hỏi này khám phá cách bạn tương tác với thế giới xung quanh và nơi bạn lấy năng lượng từ đâu.',
      questions: questionGroups.ei
    },
    {
      category: 'SN',
      title: 'Giác quan (S) - Trực giác (N)',
      description: 'Nhóm câu hỏi này tìm hiểu cách bạn thu thập và xử lý thông tin từ môi trường xung quanh.',
      questions: questionGroups.sn
    },
    {
      category: 'TF',
      title: 'Lý trí (T) - Cảm xúc (F)',
      description: 'Nhóm câu hỏi này khám phá cách bạn đưa ra quyết định và xử lý các tình huống.',
      questions: questionGroups.tf
    },
    {
      category: 'JP',
      title: 'Nguyên tắc (J) - Linh hoạt (P)',
      description: 'Nhóm câu hỏi này tìm hiểu cách bạn tổ chức cuộc sống và đối phó với các thay đổi.',
      questions: questionGroups.jp
    }
  ]
}; 