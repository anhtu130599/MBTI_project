import dbConnect from '../lib/mongodb';
import Question from '../models/Question';
import { mbtiQuestionsSample } from './mbti-questions-sample';

(async () => {
  await dbConnect();
  await Question.deleteMany({});
  await Question.insertMany(mbtiQuestionsSample.map((q, i) => ({ ...q, order: i + 1, isActive: true })));
  console.log('Đã import 20 câu hỏi MBTI mẫu thành công!');
  process.exit(0);
})(); 