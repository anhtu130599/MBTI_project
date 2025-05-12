import { Question } from '@/types/mbti';
import { questions } from '@/data/questions';

// Cấu hình các cặp tính cách và giá trị tương ứng
const mbtiPairs = [
  { key: 'EI', positive: 'E', negative: 'I' },
  { key: 'SN', positive: 'S', negative: 'N' },
  { key: 'TF', positive: 'T', negative: 'F' },
  { key: 'JP', positive: 'J', negative: 'P' },
];

// Tạo Map để truy xuất câu hỏi theo id (string)
const questionMap = new Map<string, Question>(questions.map(q => [q.id, q]));

export function calculateMBTIResult(answers: Record<string, string>): string {
  // Khởi tạo điểm cho từng cặp
  const score: Record<string, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  // Tính điểm cho từng cặp tính cách
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questionMap.get(questionId); // id là string
    if (question) {
      const pair = mbtiPairs.find(p => p.key === question.category);
      if (pair) {
        score[pair.key] += answer === pair.positive ? 1 : -1;
      }
    }
  });

  // Xác định kết quả MBTI dựa trên điểm số
  const result = mbtiPairs.map(pair => (score[pair.key] >= 0 ? pair.positive : pair.negative)).join('');
  return result;
} 