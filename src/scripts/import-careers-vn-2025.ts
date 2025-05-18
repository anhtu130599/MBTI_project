import dbConnect from '../lib/mongodb';
import Career from '../models/Career';
import { careersVN2025 } from './careers-vn-2025';

(async () => {
  await dbConnect();
  await Career.deleteMany({});
  await Career.insertMany(careersVN2025);
  console.log('Đã import xong danh sách nghề nghiệp Việt Nam 2025!');
  process.exit(0);
})(); 