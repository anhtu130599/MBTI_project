import { Question } from '@/types/mbti';

export const questions: Question[] = [
  {
    id: 1,
    text: 'Bạn thường:',
    category: 'EI',
    options: [
      { text: 'Thích giao tiếp với nhiều người', value: 'E' },
      { text: 'Thích dành thời gian một mình', value: 'I' },
    ],
  },
  {
    id: 2,
    text: 'Khi giải quyết vấn đề, bạn thường:',
    category: 'SN',
    options: [
      { text: 'Dựa vào kinh nghiệm và thực tế', value: 'S' },
      { text: 'Tìm kiếm các khả năng và ý tưởng mới', value: 'N' },
    ],
  },
  {
    id: 3,
    text: 'Khi đưa ra quyết định, bạn thường:',
    category: 'TF',
    options: [
      { text: 'Dựa vào logic và phân tích', value: 'T' },
      { text: 'Dựa vào cảm xúc và giá trị', value: 'F' },
    ],
  },
  {
    id: 4,
    text: 'Trong công việc, bạn thường:',
    category: 'JP',
    options: [
      { text: 'Lên kế hoạch và tuân thủ lịch trình', value: 'J' },
      { text: 'Linh hoạt và thích ứng với thay đổi', value: 'P' },
    ],
  },
  {
    id: 5,
    text: 'Bạn thường:',
    category: 'EI',
    options: [
      { text: 'Thích chia sẻ suy nghĩ với người khác', value: 'E' },
      { text: 'Giữ suy nghĩ cho riêng mình', value: 'I' },
    ],
  },
  {
    id: 6,
    text: 'Bạn thường tập trung vào:',
    category: 'SN',
    options: [
      { text: 'Chi tiết và thực tế hiện tại', value: 'S' },
      { text: 'Bức tranh tổng thể và tương lai', value: 'N' },
    ],
  },
  {
    id: 7,
    text: 'Khi đánh giá người khác, bạn thường:',
    category: 'TF',
    options: [
      { text: 'Dựa vào thành tích và năng lực', value: 'T' },
      { text: 'Dựa vào động cơ và hoàn cảnh', value: 'F' },
    ],
  },
  {
    id: 8,
    text: 'Bạn thường:',
    category: 'JP',
    options: [
      { text: 'Hoàn thành công việc trước khi vui chơi', value: 'J' },
      { text: 'Vui chơi trước khi hoàn thành công việc', value: 'P' },
    ],
  },
]; 