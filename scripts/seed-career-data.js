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

// Comprehensive career data for all 16 MBTI types
const careersData = [
  // ENFP Careers
  {
    title: 'Chuyên viên Marketing',
    description: 'Phát triển và thực hiện các chiến lược marketing để quảng bá sản phẩm và dịch vụ',
    industry: 'Marketing & Truyền thông',
    salaryRange: { min: 12000000, max: 25000000, currency: 'VND' },
    requiredSkills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'Creative Writing'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ENFP', 'ESFP', 'ENTP'],
    workEnvironment: 'Văn phòng mở, làm việc nhóm',
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
  },

  // INTJ Careers
  {
    title: 'Kỹ sư phần mềm',
    description: 'Thiết kế và phát triển các ứng dụng phần mềm, hệ thống thông tin',
    industry: 'Công nghệ thông tin',
    salaryRange: { min: 20000000, max: 50000000, currency: 'VND' },
    requiredSkills: ['Programming', 'System Design', 'Problem Solving', 'Database Management'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['INTJ', 'INTP', 'ENTJ'],
    workEnvironment: 'Văn phòng, làm việc độc lập',
    location: 'Hồ Chí Minh',
    jobOutlook: 'Tăng trưởng mạnh với sự phát triển của công nghệ'
  },
  {
    title: 'Kiến trúc sư hệ thống',
    description: 'Thiết kế và xây dựng các hệ thống công nghệ thông tin phức tạp',
    industry: 'Công nghệ thông tin',
    salaryRange: { min: 30000000, max: 70000000, currency: 'VND' },
    requiredSkills: ['System Architecture', 'Cloud Computing', 'Security', 'Integration'],
    educationLevel: 'Đại học',
    experienceLevel: 'Senior',
    personalityTypes: ['INTJ', 'INTP', 'ENTJ'],
    workEnvironment: 'Văn phòng, làm việc nhóm dự án',
    location: 'Hà Nội',
    jobOutlook: 'Nhu cầu cao với xu hướng chuyển đổi số'
  },

  // INTP Careers
  {
    title: 'Data Scientist',
    description: 'Phân tích dữ liệu lớn để đưa ra insights và hỗ trợ quyết định kinh doanh',
    industry: 'Công nghệ thông tin',
    salaryRange: { min: 25000000, max: 60000000, currency: 'VND' },
    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'Data Visualization'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['INTP', 'INTJ', 'ENTP'],
    workEnvironment: 'Văn phòng, làm việc độc lập',
    location: 'Hồ Chí Minh',
    jobOutlook: 'Tăng trưởng mạnh với xu hướng AI/ML'
  },

  // ENTJ Careers
  {
    title: 'Giám đốc điều hành',
    description: 'Lãnh đạo và điều hành tổ chức, đưa ra chiến lược phát triển',
    industry: 'Quản lý & Lãnh đạo',
    salaryRange: { min: 50000000, max: 200000000, currency: 'VND' },
    requiredSkills: ['Leadership', 'Strategic Planning', 'Business Management', 'Communication'],
    educationLevel: 'Thạc sĩ',
    experienceLevel: 'Executive',
    personalityTypes: ['ENTJ', 'ESTJ', 'INTJ'],
    workEnvironment: 'Văn phòng, họp bàn, gặp gỡ đối tác',
    location: 'Thành phố lớn',
    jobOutlook: 'Ổn định với nhu cầu lãnh đạo tài năng'
  },

  // ENTP Careers
  {
    title: 'Doanh nhân',
    description: 'Khởi nghiệp và phát triển doanh nghiệp, tạo ra giá trị mới',
    industry: 'Khởi nghiệp & Kinh doanh',
    salaryRange: { min: 0, max: 1000000000, currency: 'VND' },
    requiredSkills: ['Business Development', 'Innovation', 'Risk Management', 'Networking'],
    educationLevel: 'Đại học',
    experienceLevel: 'Executive',
    personalityTypes: ['ENTP', 'ENTJ', 'ENFP'],
    workEnvironment: 'Linh hoạt, nhiều thay đổi',
    location: 'Toàn quốc',
    jobOutlook: 'Cơ hội lớn với chính sách hỗ trợ khởi nghiệp'
  },

  // INFJ Careers
  {
    title: 'Tư vấn viên tâm lý',
    description: 'Hỗ trợ tâm lý cho cá nhân và gia đình, giải quyết các vấn đề tâm lý',
    industry: 'Y tế & Chăm sóc sức khỏe',
    salaryRange: { min: 15000000, max: 40000000, currency: 'VND' },
    requiredSkills: ['Psychology', 'Counseling', 'Active Listening', 'Empathy'],
    educationLevel: 'Thạc sĩ',
    experienceLevel: 'Senior',
    personalityTypes: ['INFJ', 'INFP', 'ENFJ'],
    workEnvironment: 'Phòng tư vấn yên tĩnh',
    location: 'Thành phố lớn',
    jobOutlook: 'Tăng trưởng với nhận thức về sức khỏe tâm thần'
  },

  // INFP Careers
  {
    title: 'Nhà văn',
    description: 'Sáng tác nội dung, viết sách, bài viết và các tác phẩm văn học',
    industry: 'Văn hóa & Nghệ thuật',
    salaryRange: { min: 8000000, max: 30000000, currency: 'VND' },
    requiredSkills: ['Creative Writing', 'Storytelling', 'Research', 'Editing'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['INFP', 'INFJ', 'ENFP'],
    workEnvironment: 'Làm việc độc lập, sáng tạo',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với sự phát triển của nội dung số'
  },

  // ENFJ Careers
  {
    title: 'Giảng viên đại học',
    description: 'Giảng dạy và nghiên cứu tại các trường đại học, cao đẳng',
    industry: 'Giáo dục',
    salaryRange: { min: 20000000, max: 50000000, currency: 'VND' },
    requiredSkills: ['Teaching', 'Research', 'Communication', 'Mentoring'],
    educationLevel: 'Thạc sĩ',
    experienceLevel: 'Senior',
    personalityTypes: ['ENFJ', 'INFJ', 'ENFP'],
    workEnvironment: 'Trường học, phòng thí nghiệm',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với chính sách phát triển giáo dục'
  },

  // ISTJ Careers
  {
    title: 'Kế toán viên',
    description: 'Quản lý và báo cáo tài chính, đảm bảo tuân thủ quy định',
    industry: 'Tài chính & Kế toán',
    salaryRange: { min: 12000000, max: 35000000, currency: 'VND' },
    requiredSkills: ['Accounting', 'Financial Reporting', 'Tax Law', 'Excel'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ISTJ', 'ESTJ', 'ISFJ'],
    workEnvironment: 'Văn phòng có cấu trúc',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với nhu cầu quản lý tài chính'
  },

  // ISFJ Careers
  {
    title: 'Điều dưỡng viên',
    description: 'Chăm sóc sức khỏe bệnh nhân, hỗ trợ bác sĩ trong điều trị',
    industry: 'Y tế & Chăm sóc sức khỏe',
    salaryRange: { min: 10000000, max: 25000000, currency: 'VND' },
    requiredSkills: ['Patient Care', 'Medical Procedures', 'Communication', 'Empathy'],
    educationLevel: 'Cao đẳng',
    experienceLevel: 'Mid',
    personalityTypes: ['ISFJ', 'ESFJ', 'INFJ'],
    workEnvironment: 'Bệnh viện, phòng khám',
    location: 'Toàn quốc',
    jobOutlook: 'Tăng trưởng với nhu cầu chăm sóc sức khỏe'
  },

  // ESTJ Careers
  {
    title: 'Quản lý dự án',
    description: 'Lãnh đạo và quản lý các dự án, đảm bảo hoàn thành đúng tiến độ',
    industry: 'Quản lý & Lãnh đạo',
    salaryRange: { min: 25000000, max: 60000000, currency: 'VND' },
    requiredSkills: ['Project Management', 'Leadership', 'Planning', 'Communication'],
    educationLevel: 'Đại học',
    experienceLevel: 'Senior',
    personalityTypes: ['ESTJ', 'ENTJ', 'ISTJ'],
    workEnvironment: 'Văn phòng, họp bàn',
    location: 'Thành phố lớn',
    jobOutlook: 'Tăng trưởng với nhu cầu quản lý dự án'
  },

  // ESFJ Careers
  {
    title: 'Nhân viên nhân sự',
    description: 'Quản lý nhân sự, tuyển dụng và phát triển nguồn nhân lực',
    industry: 'Nhân sự',
    salaryRange: { min: 12000000, max: 35000000, currency: 'VND' },
    requiredSkills: ['HR Management', 'Recruitment', 'Employee Relations', 'Communication'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ESFJ', 'ENFJ', 'ISFJ'],
    workEnvironment: 'Văn phòng, tương tác nhiều',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với nhu cầu quản lý nhân sự'
  },

  // ISTP Careers
  {
    title: 'Kỹ sư cơ khí',
    description: 'Thiết kế và bảo trì các hệ thống cơ khí, máy móc',
    industry: 'Cơ khí & Chế tạo',
    salaryRange: { min: 15000000, max: 40000000, currency: 'VND' },
    requiredSkills: ['Mechanical Design', 'CAD', 'Problem Solving', 'Technical Skills'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ISTP', 'ESTP', 'INTP'],
    workEnvironment: 'Nhà máy, xưởng sản xuất',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với nhu cầu công nghiệp'
  },

  // ISFP Careers
  {
    title: 'Thiết kế đồ họa',
    description: 'Tạo ra các thiết kế sáng tạo cho thương hiệu, sản phẩm',
    industry: 'Thiết kế & Sáng tạo',
    salaryRange: { min: 10000000, max: 30000000, currency: 'VND' },
    requiredSkills: ['Graphic Design', 'Adobe Creative Suite', 'Creativity', 'Visual Communication'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ISFP', 'INFP', 'ENFP'],
    workEnvironment: 'Studio thiết kế, làm việc độc lập',
    location: 'Thành phố lớn',
    jobOutlook: 'Tăng trưởng với nhu cầu thiết kế số'
  },

  // ESTP Careers
  {
    title: 'Nhân viên bán hàng',
    description: 'Tư vấn và bán sản phẩm, dịch vụ cho khách hàng',
    industry: 'Bán hàng & Marketing',
    salaryRange: { min: 8000000, max: 25000000, currency: 'VND' },
    requiredSkills: ['Sales Techniques', 'Communication', 'Negotiation', 'Customer Service'],
    educationLevel: 'Trung cấp',
    experienceLevel: 'Entry',
    personalityTypes: ['ESTP', 'ESFP', 'ENTP'],
    workEnvironment: 'Cửa hàng, gặp gỡ khách hàng',
    location: 'Toàn quốc',
    jobOutlook: 'Ổn định với nhu cầu thương mại'
  },

  // ESFP Careers
  {
    title: 'Tổ chức sự kiện',
    description: 'Lập kế hoạch và tổ chức các sự kiện, hội nghị, tiệc cưới',
    industry: 'Tổ chức sự kiện',
    salaryRange: { min: 12000000, max: 35000000, currency: 'VND' },
    requiredSkills: ['Event Planning', 'Coordination', 'Communication', 'Creativity'],
    educationLevel: 'Đại học',
    experienceLevel: 'Mid',
    personalityTypes: ['ESFP', 'ENFP', 'ESTP'],
    workEnvironment: 'Sự kiện, văn phòng',
    location: 'Thành phố lớn',
    jobOutlook: 'Tăng trưởng với nhu cầu tổ chức sự kiện'
  }
];

async function seedCareers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing career data
    console.log('Clearing existing career data...');
    await Career.deleteMany({});

    // Insert new career data
    const result = await Career.insertMany(careersData);
    console.log(`${result.length} careers inserted successfully`);

    console.log('Career seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding careers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedCareers(); 