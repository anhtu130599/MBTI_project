import mongoose from 'mongoose';
import path from 'path';
import { mbtiResults } from '../data/results';
import Career from '../models/Career';
import dbConnect from '../lib/mongodb';

(async () => {
  await dbConnect();
  // Gộp nghề nghiệp từ mbtiResults
  const careerMap = {};
  for (const type in mbtiResults) {
    const result = mbtiResults[type];
    for (const careerTitle of result.careers) {
      if (!careerMap[careerTitle]) {
        careerMap[careerTitle] = {
          title: careerTitle,
          description: '',
          personalityTypes: [type],
          skills: [],
          education: '',
          salary: '',
        };
      } else {
        careerMap[careerTitle].personalityTypes.push(type);
      }
    }
  }
  // Xóa toàn bộ collection cũ
  await Career.deleteMany({});
  // Insert lại dữ liệu mới
  await Career.insertMany(Object.values(careerMap));
  console.log('Đã import xong danh sách nghề nghiệp từ results.ts vào database!');
  process.exit(0);
})(); 