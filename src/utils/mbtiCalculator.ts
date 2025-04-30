import { Question } from '@/types/mbti';
import { questions } from '@/data/questions';

export function calculateMBTIResult(answers: Record<number, string>): string {
  let eiCount = 0;
  let snCount = 0;
  let tfCount = 0;
  let jpCount = 0;

  // Tính điểm cho từng cặp tính cách
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      switch (question.category) {
        case 'EI':
          eiCount += answer === 'E' ? 1 : -1;
          break;
        case 'SN':
          snCount += answer === 'S' ? 1 : -1;
          break;
        case 'TF':
          tfCount += answer === 'T' ? 1 : -1;
          break;
        case 'JP':
          jpCount += answer === 'J' ? 1 : -1;
          break;
      }
    }
  });

  // Xác định kết quả MBTI
  const result = [
    eiCount >= 0 ? 'E' : 'I',
    snCount >= 0 ? 'S' : 'N',
    tfCount >= 0 ? 'T' : 'F',
    jpCount >= 0 ? 'J' : 'P',
  ].join('');

  return result;
} 