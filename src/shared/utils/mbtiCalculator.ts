import { Question } from '@/core/domain/entities/Question';

// Cấu hình các cặp tính cách và giá trị tương ứng
const mbtiPairs = [
  { key: 'EI', positive: 'E', negative: 'I' },
  { key: 'SN', positive: 'S', negative: 'N' },
  { key: 'TF', positive: 'T', negative: 'F' },
  { key: 'JP', positive: 'J', negative: 'P' },
];

// Tạo Map để truy xuất câu hỏi theo id (string)
const questionMap = new Map<string, Question>();

export function calculateMBTIResult(answers: Record<string, string>, questions: { _id: string, category: string }[]): string {
  const score: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  questions.forEach(q => {
    const answer = answers[q._id];
    const pair = mbtiPairs.find(p => p.key === q.category);
    if (answer && pair) {
      score[pair.key] += answer === pair.positive ? 1 : -1;
    }
  });
  return mbtiPairs.map(pair => (score[pair.key] >= 0 ? pair.positive : pair.negative)).join('');
} 
