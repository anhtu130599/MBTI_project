const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Question schema to match the model
const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      enum: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'],
    },
  }],
  category: {
    type: String,
    required: true,
    enum: ['EI', 'SN', 'TF', 'JP'],
  },
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', QuestionSchema);

// Sample questions with proper format (each option has unique ID)
const sampleQuestions = [
  {
    text: 'Khi bạn đi đến một nơi nào đó trong ngày, bạn sẽ:',
    options: [
      { id: 'q1_opt1', text: 'Lên danh sách các công việc và thời gian thực hiện', value: 'J' },
      { id: 'q1_opt2', text: 'Nghĩ đến công việc sẽ làm rồi đi thôi', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Nếu bạn là một giáo viên, bạn muốn dạy:',
    options: [
      { id: 'q2_opt1', text: 'Các khóa học thực nghiệm (thực tế)', value: 'S' },
      { id: 'q2_opt2', text: 'Các khóa học liên quan đến lý thuyết', value: 'N' },
    ],
    category: 'SN',
  },
  {
    text: 'Thường thì bạn có phải là một người:',
    options: [
      { id: 'q3_opt1', text: 'Chủ động giao lưu/giao tiếp', value: 'E' },
      { id: 'q3_opt2', text: 'Trầm tính và dè dặt', value: 'I' },
    ],
    category: 'EI',
  },
  {
    text: 'Bạn thường xuyên hành động theo:',
    options: [
      { id: 'q4_opt1', text: 'Cảm tính, trái tim sẽ đưa ra quyết định', value: 'F' },
      { id: 'q4_opt2', text: 'Lý trí, suy nghĩ logic rồi quyết định', value: 'T' },
    ],
    category: 'TF',
  },
  {
    text: 'Khi làm những việc mà nhiều người khác vẫn thường hay làm, thì ý nào hấp dẫn bạn hơn:',
    options: [
      { id: 'q5_opt1', text: 'Phát triển theo cách riêng của bạn', value: 'N' },
      { id: 'q5_opt2', text: 'Làm theo cách truyền thống', value: 'S' },
    ],
    category: 'SN',
  },
  {
    text: 'Trong nhóm bạn bè, bạn là người:',
    options: [
      { id: 'q6_opt1', text: 'Nắm bắt tin tức về mọi người', value: 'E' },
      { id: 'q6_opt2', text: 'Là một trong những người cuối cùng biết chuyện', value: 'I' },
    ],
    category: 'EI',
  },
  {
    text: 'Ý tưởng việc lập danh sách những việc bạn cần hoàn thành vào cuối tuần:',
    options: [
      { id: 'q7_opt1', text: 'Hấp dẫn với bạn', value: 'J' },
      { id: 'q7_opt2', text: 'Bạn rất chán nản với nó', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Khi bạn có một công việc đặc biệt để làm, bạn muốn:',
    options: [
      { id: 'q8_opt1', text: 'Lên kế hoạch cẩn thận trước khi bắt đầu', value: 'J' },
      { id: 'q8_opt2', text: 'Tìm ra những điều cần thiết trong quá trình', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Bạn có xu hướng:',
    options: [
      { id: 'q9_opt1', text: 'Mở rộng tình bạn với nhiều người', value: 'E' },
      { id: 'q9_opt2', text: 'Kết bạn với rất ít người nhưng sâu sắc', value: 'I' },
    ],
    category: 'EI',
  },
  {
    text: 'Bạn hâm mộ những người:',
    options: [
      { id: 'q10_opt1', text: 'Khá bình thường, không gây chú ý', value: 'S' },
      { id: 'q10_opt2', text: 'Quá lập dị, không bận tâm khác người', value: 'N' },
    ],
    category: 'SN',
  },
  {
    text: 'Bạn có thích:',
    options: [
      { id: 'q11_opt1', text: 'Sắp xếp buổi dã ngoại thuận lợi nhất', value: 'J' },
      { id: 'q11_opt2', text: 'Tự do làm bất cứ điều gì tùy thời điểm', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Bạn thường quan hệ tốt với:',
    options: [
      { id: 'q12_opt1', text: 'Người suy nghĩ thực tế', value: 'S' },
      { id: 'q12_opt2', text: 'Người mơ mộng (tưởng tượng)', value: 'N' },
    ],
    category: 'SN',
  },
  {
    text: 'Khi là thành viên một nhóm, bạn thường:',
    options: [
      { id: 'q13_opt1', text: 'Tham gia vào cuộc nói chuyện của nhóm', value: 'E' },
      { id: 'q13_opt2', text: 'Ngồi tưởng tượng một mình', value: 'I' },
    ],
    category: 'EI',
  },
  {
    text: 'Bạn muốn được gọi là:',
    options: [
      { id: 'q14_opt1', text: 'Người đa cảm', value: 'F' },
      { id: 'q14_opt2', text: 'Người lý trí', value: 'T' },
    ],
    category: 'TF',
  },
  {
    text: 'Khi đọc để giải trí, bạn thích:',
    options: [
      { id: 'q15_opt1', text: 'Cách viết phá cách, truyền thống', value: 'S' },
      { id: 'q15_opt2', text: 'Tác giả viết chính xác những gì họ nghĩ', value: 'N' },
    ],
    category: 'SN',
  },
  {
    text: 'Bạn có thể dễ dàng nói chuyện thật lâu với:',
    options: [
      { id: 'q16_opt1', text: 'Hầu hết tất cả mọi người', value: 'E' },
      { id: 'q16_opt2', text: 'Chỉ một vài người nhất định', value: 'I' },
    ],
    category: 'EI',
  },
  {
    text: 'Việc tuân thủ/làm theo một thời khóa biểu có:',
    options: [
      { id: 'q17_opt1', text: 'Thu hút/hấp dẫn bạn', value: 'J' },
      { id: 'q17_opt2', text: 'Khiến bạn cảm thấy bị gò bó', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Khi được ủy nhiệm làm điều gì đó vào thời điểm nhất định, bạn cảm thấy:',
    options: [
      { id: 'q18_opt1', text: 'Tốt để lập kế hoạch phù hợp', value: 'J' },
      { id: 'q18_opt2', text: 'Khó chịu vì bị ràng buộc', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Bạn thành công hơn khi:',
    options: [
      { id: 'q19_opt1', text: 'Cẩn thận làm theo kế hoạch', value: 'J' },
      { id: 'q19_opt2', text: 'Đối phó với bất ngờ, linh hoạt', value: 'P' },
    ],
    category: 'JP',
  },
  {
    text: 'Bạn muốn được coi là:',
    options: [
      { id: 'q20_opt1', text: 'Người thực tế, thực dụng', value: 'S' },
      { id: 'q20_opt2', text: 'Người khéo léo, mưu trí', value: 'N' },
    ],
    category: 'SN',
  },
];

async function seedQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing questions');
    
    // Insert new questions
    const insertedQuestions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${insertedQuestions.length} questions`);
    
    // Verify questions structure
    console.log('\n📋 Sample question structure:');
    const firstQuestion = await Question.findOne();
    console.log('Question ID:', firstQuestion._id.toString());
    console.log('Question text:', firstQuestion.text);
    console.log('Options:');
    firstQuestion.options.forEach((opt, index) => {
      console.log(`  ${index + 1}. ID: ${opt.id}, Text: ${opt.text}, Value: ${opt.value}`);
    });
    console.log('Category:', firstQuestion.category);
    
    console.log('\n🎯 Questions seeded successfully!');
    console.log('Now test the MBTI calculation should work properly.');
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedQuestions(); 