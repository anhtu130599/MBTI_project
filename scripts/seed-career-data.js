const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Define Career schema inline
const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  industry: { type: String, required: true, trim: true },
  salaryRange: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'VND' },
  },
  requiredSkills: [{ type: String, required: true, trim: true }],
  educationLevel: { type: String, required: true, trim: true },
  experienceLevel: { type: String, required: true, enum: ['Entry', 'Mid', 'Senior', 'Executive'] },
  personalityTypes: [{ type: String, required: true, match: /^[A-Z]{4}$/ }],
  workEnvironment: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  jobOutlook: { type: String, required: true },
}, { timestamps: true });

const Career = mongoose.model('Career', CareerSchema);

// Sample career data for ENFP
const careersData = [
  {
    title: 'Chuyên viên Marketing',
    description: 'Phát triển và thực hiện các chiến lược marketing để quảng bá sản phẩm và dịch vụ',
    industry: 'Marketing & Truyền thông',
    salaryRange: { min: 12000000, max: 25000000, currency: 'VND' },
    requiredSkills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'Creative Writing'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ENFP', 'ESFP', 'ENTP'],
    workEnvironment: 'Văn phông mở, làm việc nhóm',
    location: 'Hồ Chí Minh',
    jobOutlook: 'Tăng trưởng mạnh do phát triển thương mại điện tử'
  },
  {
    title: 'Nhà tư vấn nghề nghiệp',
    description: 'Hỗ trợ và tư vấn cho cá nhân về định hướng nghề nghiệp và phát triển sự nghiệp',
    industry: 'Giáo dục & Tư vấn',
    salaryRange: { min: 15000000, max: 30000000, currency: 'VND' },
    requiredSkills: ['Counseling', 'Psychology', 'Communication', 'Assessment Tools'],
    educationLevel: 'Thạc sĩ',
    experienceLevel: 'Senior',
    personalityTypes: ['ENFP', 'ENFJ', 'INFP'],
    workEnvironment: 'Phòng tư vấn, gặp gỡ khách hàng',
    location: 'Hà Nội',
    jobOutlook: 'Ổn định với nhu cầu tăng trong thời đại chuyển đổi nghề nghiệp'
  },
  {
    title: 'Giáo viên Tiếng Anh',
    description: 'Giảng dạy tiếng Anh cho học sinh các cấp, phát triển kỹ năng ngôn ngữ',
    industry: 'Giáo dục',
    salaryRange: { min: 8000000, max: 18000000, currency: 'VND' },
    requiredSkills: ['English Proficiency', 'Teaching Methods', 'Classroom Management', 'Curriculum Development'],
    educationLevel: 'Đại học',
    experienceLevel: 'Entry',
    personalityTypes: ['ENFP', 'ENFJ', 'ESFJ'],
    workEnvironment: 'Lớp học, tương tác với học sinh',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với nhu cầu học tiếng Anh cao'
  },
  {
    title: 'Nhà thiết kế đồ họa',
    description: 'Tạo ra các thiết kế trực quan cho website, ấn phẩm và các phương tiện truyền thông',
    industry: 'Thiết kế & Sáng tạo',
    salaryRange: { min: 10000000, max: 22000000, currency: 'VND' },
    requiredSkills: ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Brand Design'],
    educationLevel: 'Cao đẳng',
    experienceLevel: 'Mid',
    personalityTypes: ['ENFP', 'ISFP', 'INFP'],
    workEnvironment: 'Studio thiết kế, làm việc sáng tạo',
    location: 'Hồ Chí Minh',
    jobOutlook: 'Tăng trưởng mạnh do nhu cầu digital marketing'
  },
  {
    title: 'Chuyên viên PR',
    description: 'Quản lý hình ảnh công ty, xây dựng mối quan hệ với truyền thông và công chúng',
    industry: 'Quan hệ công chúng',
    salaryRange: { min: 13000000, max: 28000000, currency: 'VND' },
    requiredSkills: ['Media Relations', 'Event Management', 'Crisis Communication', 'Content Strategy'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ENFP', 'ESFJ', 'ENFJ'],
    workEnvironment: 'Văn phòng, sự kiện, gặp gỡ khách hàng',
    location: 'Hà Nội',
    jobOutlook: 'Tăng trưởng ổn định với sự phát triển của các doanh nghiệp'
  },
  {
    title: 'Nhà tâm lý học',
    description: 'Cung cấp dịch vụ tư vấn tâm lý, hỗ trợ sức khỏe tinh thần cho cá nhân và gia đình',
    industry: 'Y tế & Chăm sóc sức khỏe',
    salaryRange: { min: 18000000, max: 35000000, currency: 'VND' },
    requiredSkills: ['Clinical Psychology', 'Counseling Techniques', 'Assessment', 'Therapy Methods'],
    educationLevel: 'Thạc sĩ',
    experienceLevel: 'Senior',
    personalityTypes: ['ENFP', 'INFP', 'ENFJ'],
    workEnvironment: 'Phòng khám, bệnh viện, trung tâm tư vấn',
    location: 'Thành phố lớn',
    jobOutlook: 'Tăng trưởng mạnh do nhận thức về sức khỏe tinh thần tăng'
  }
];

async function seedCareers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing careers
    console.log('Clearing existing career data...');
    await Career.deleteMany({});

    // Insert new careers
    console.log('Inserting career data...');
    await Career.insertMany(careersData);
    console.log(`${careersData.length} careers inserted successfully`);

    console.log('Career seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding careers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedCareers(); 