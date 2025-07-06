const mongoose = require('mongoose');
// require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Define schemas inline for seeding
const MBTIDimensionInfoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name_en: { type: String, required: true },
  name_vi: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String, required: true }],
  examples: [{ type: String }],
  dimension_type: { type: String, required: true, enum: ['EI', 'SN', 'TF', 'JP'] },
}, { timestamps: true });

const PersonalityDetailInfoSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true, match: /^[A-Z]{4}$/ },
  name: { type: String, required: true },
  description: { type: String, required: true },
  note: { type: String, required: true },
  trait_percentages: {
    E: { type: Number, required: true, min: 0, max: 100 },
    I: { type: Number, required: true, min: 0, max: 100 },
    S: { type: Number, required: true, min: 0, max: 100 },
    N: { type: Number, required: true, min: 0, max: 100 },
    T: { type: Number, required: true, min: 0, max: 100 },
    F: { type: Number, required: true, min: 0, max: 100 },
    J: { type: Number, required: true, min: 0, max: 100 },
    P: { type: Number, required: true, min: 0, max: 100 },
  },
  dimensions: [{
    dimension: { type: String, required: true, enum: ['EI', 'SN', 'TF', 'JP'] },
    dimension_name_vi: { type: String, required: true },
    trait_a: {
      id: String,
      name_en: String,
      name_vi: String,
      description: String,
      keywords: [String],
      examples: [String],
      dimension_type: { type: String, enum: ['EI', 'SN', 'TF', 'JP'] },
    },
    trait_b: {
      id: String,
      name_en: String,
      name_vi: String,
      description: String,
      keywords: [String],
      examples: [String],
      dimension_type: { type: String, enum: ['EI', 'SN', 'TF', 'JP'] },
    },
  }],
  strengths: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    why_explanation: { type: String, required: true },
  }],
  weaknesses: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    why_explanation: { type: String, required: true },
    improvement_advice: { type: String, required: true },
  }],
  development_advice: [{ type: String, required: true }],
  relationship_analysis: {
    interaction_style: { type: String, required: true },
    improvement_tips: [{ type: String, required: true }],
  },
  career_guidance: {
    suitable_fields: [{ type: String, required: true }],
    improvement_skills: [{ type: String, required: true }],
    career_matches: [{ type: String, required: true }],
  },
  work_environment_preferred: { type: String, required: true },
  work_environment_avoid: { type: String, required: true },
}, { timestamps: true, collection: 'personalitydetailinfos' });

const MBTIDimensionInfo = mongoose.model('MBTIDimensionInfo', MBTIDimensionInfoSchema);
const PersonalityDetailInfo = mongoose.model('PersonalityDetailInfo', PersonalityDetailInfoSchema);

// Sample dimension data
const dimensionsData = [
  // Extraversion - Introversion
  {
    id: 'E',
    name_en: 'Extraversion',
    name_vi: 'Hướng ngoại',
    description: 'Năng lượng được hướng ra bên ngoài, thích tương tác với mọi người và môi trường xung quanh',
    keywords: ['Năng động', 'Giao tiếp', 'Tự tin', 'Thích hoạt động nhóm', 'Thích chia sẻ'],
    examples: ['Thích làm việc nhóm', 'Dễ dàng bắt chuyện với người lạ', 'Thích các hoạt động xã hội'],
    dimension_type: 'EI'
  },
  {
    id: 'I',
    name_en: 'Introversion',
    name_vi: 'Hướng nội',
    description: 'Năng lượng được hướng vào bên trong, thích suy nghĩ và hoạt động độc lập',
    keywords: ['Trầm lặng', 'Suy nghĩ sâu', 'Độc lập', 'Tập trung', 'Thích không gian riêng'],
    examples: ['Thích làm việc một mình', 'Cần thời gian suy nghĩ trước khi quyết định', 'Thích các hoạt động yên tĩnh'],
    dimension_type: 'EI'
  },
  
  // Sensing - Intuition
  {
    id: 'S',
    name_en: 'Sensing',
    name_vi: 'Cảm giác',
    description: 'Thu nhận thông tin thông qua các giác quan, tập trung vào chi tiết và thực tế',
    keywords: ['Thực tế', 'Chi tiết', 'Cụ thể', 'Kinh nghiệm', 'Hiện tại'],
    examples: ['Chú ý đến chi tiết nhỏ', 'Tin vào kinh nghiệm thực tế', 'Thích các thông tin cụ thể'],
    dimension_type: 'SN'
  },
  {
    id: 'N',
    name_en: 'Intuition',
    name_vi: 'Trực giác',
    description: 'Thu nhận thông tin thông qua trực giác, tập trung vào khả năng và ý tưởng',
    keywords: ['Sáng tạo', 'Tương lai', 'Khả năng', 'Ý tưởng', 'Tổng thể'],
    examples: ['Thích tìm ra các khả năng mới', 'Tập trung vào bức tranh tổng thể', 'Thích các ý tưởng trừu tượng'],
    dimension_type: 'SN'
  },
  
  // Thinking - Feeling
  {
    id: 'T',
    name_en: 'Thinking',
    name_vi: 'Tư duy',
    description: 'Đưa ra quyết định dựa trên logic và lý trí',
    keywords: ['Logic', 'Khách quan', 'Phân tích', 'Công bằng', 'Hiệu quả'],
    examples: ['Đưa ra quyết định dựa trên dữ liệu', 'Ưu tiên tính hiệu quả', 'Phân tích pros và cons'],
    dimension_type: 'TF'
  },
  {
    id: 'F',
    name_en: 'Feeling',
    name_vi: 'Cảm xúc',
    description: 'Đưa ra quyết định dựa trên giá trị và cảm xúc',
    keywords: ['Cảm xúc', 'Giá trị cá nhân', 'Hòa hợp', 'Đồng cảm', 'Con người'],
    examples: ['Xem xét ảnh hưởng đến người khác', 'Ưu tiên hòa hợp trong nhóm', 'Quyết định dựa trên giá trị'],
    dimension_type: 'TF'
  },
  
  // Judging - Perceiving
  {
    id: 'J',
    name_en: 'Judging',
    name_vi: 'Phán đoán',
    description: 'Thích có kế hoạch và cấu trúc rõ ràng',
    keywords: ['Có tổ chức', 'Kế hoạch', 'Quyết định', 'Thời hạn', 'Ổn định'],
    examples: ['Lên kế hoạch chi tiết', 'Thích có thời hạn cụ thể', 'Làm việc theo lịch trình'],
    dimension_type: 'JP'
  },
  {
    id: 'P',
    name_en: 'Perceiving',
    name_vi: 'Nhận thức',
    description: 'Thích sự linh hoạt và tự phát',
    keywords: ['Linh hoạt', 'Tự phát', 'Thích nghi', 'Khám phá', 'Mở'],
    examples: ['Thích thay đổi kế hoạch', 'Làm việc tốt dưới áp lực', 'Thích khám phá các lựa chọn'],
    dimension_type: 'JP'
  }
];

// Sample personality data for all 16 MBTI types
const personalityData = [
  // ENFP - Người truyền cảm hứng
  {
    type: 'ENFP',
    name: 'Người truyền cảm hứng',
    description: 'Nhiệt huyết, sáng tạo, luôn mang lại năng lượng tích cực cho mọi người.',
    note: 'Thích tự do, không thích bị gò bó bởi quy tắc.',
    trait_percentages: { E: 75, I: 25, S: 30, N: 70, T: 35, F: 65, J: 40, P: 60 },
    dimensions: [
      {
        dimension: 'EI',
        dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: {
          id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại',
          description: 'Năng lượng được hướng ra bên ngoài, thích tương tác với mọi người',
          keywords: ['Năng động', 'Giao tiếp', 'Tự tin'], examples: ['Thích làm việc nhóm'], dimension_type: 'EI'
        },
        trait_b: {
          id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội',
          description: 'Năng lượng được hướng vào bên trong, thích suy nghĩ độc lập',
          keywords: ['Trầm lặng', 'Suy nghĩ sâu'], examples: ['Thích làm việc một mình'], dimension_type: 'EI'
        }
      },
      {
        dimension: 'SN',
        dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: {
          id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác',
          description: 'Thu nhận thông tin qua giác quan, tập trung vào thực tế',
          keywords: ['Thực tế', 'Chi tiết'], examples: ['Chú ý chi tiết'], dimension_type: 'SN'
        },
        trait_b: {
          id: 'N', name_en: 'Intuition', name_vi: 'Trực giác',
          description: 'Thu nhận thông tin qua trực giác, tập trung vào khả năng',
          keywords: ['Sáng tạo', 'Tương lai'], examples: ['Thích ý tưởng mới'], dimension_type: 'SN'
        }
      },
      {
        dimension: 'TF',
        dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: {
          id: 'T', name_en: 'Thinking', name_vi: 'Tư duy',
          description: 'Quyết định dựa trên logic và lý trí',
          keywords: ['Logic', 'Khách quan'], examples: ['Phân tích dữ liệu'], dimension_type: 'TF'
        },
        trait_b: {
          id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc',
          description: 'Quyết định dựa trên giá trị và cảm xúc',
          keywords: ['Cảm xúc', 'Đồng cảm'], examples: ['Quan tâm người khác'], dimension_type: 'TF'
        }
      },
      {
        dimension: 'JP',
        dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: {
          id: 'J', name_en: 'Judging', name_vi: 'Phán đoán',
          description: 'Thích có kế hoạch và cấu trúc rõ ràng',
          keywords: ['Có tổ chức', 'Kế hoạch'], examples: ['Lên kế hoạch chi tiết'], dimension_type: 'JP'
        },
        trait_b: {
          id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức',
          description: 'Thích sự linh hoạt và tự phát',
          keywords: ['Linh hoạt', 'Tự phát'], examples: ['Thích thay đổi'], dimension_type: 'JP'
        }
      }
    ],
    strengths: [
      { title: 'Sáng tạo', description: 'Luôn có ý tưởng mới.', why_explanation: 'Tư duy mở và linh hoạt.' },
      { title: 'Truyền cảm hứng', description: 'Tạo động lực cho người khác.', why_explanation: 'Nhiệt tình và lạc quan.' }
    ],
    weaknesses: [
      { title: 'Dễ mất tập trung', description: 'Khó kiên trì với việc lặp lại.', why_explanation: 'Thích sự mới mẻ.', improvement_advice: 'Chia nhỏ mục tiêu để dễ hoàn thành.' }
    ],
    development_advice: ['Rèn luyện sự kiên nhẫn.', 'Tập trung vào mục tiêu quan trọng.'],
    relationship_analysis: {
      interaction_style: 'Thân thiện, dễ kết bạn.',
      improvement_tips: ['Lắng nghe nhiều hơn.', 'Tôn trọng ý kiến khác biệt.']
    },
    career_guidance: {
      suitable_fields: ['Marketing', 'Giáo dục', 'Truyền thông'],
      improvement_skills: ['Quản lý thời gian', 'Lập kế hoạch'],
      career_matches: ['Chuyên viên sáng tạo', 'Giáo viên', 'Tư vấn viên']
    },
    work_environment_preferred: 'Môi trường sáng tạo, năng động, nhiều cơ hội giao tiếp và thử thách mới.',
    work_environment_avoid: 'Môi trường gò bó, ít sáng tạo, quá nhiều quy tắc cứng nhắc.'
  },
  // ESTJ - Người điều hành
  {
    type: 'ESTJ',
    name: 'Người điều hành',
    description: 'Thực tế, quyết đoán, thích tổ chức và quản lý công việc.',
    note: 'Luôn đề cao trách nhiệm và kỷ luật.',
    trait_percentages: { E: 70, I: 30, S: 75, N: 25, T: 80, F: 20, J: 85, P: 15 },
    dimensions: [
      {
        dimension: 'EI',
        dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: {
          id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại',
          description: 'Năng lượng được hướng ra bên ngoài, thích tương tác với mọi người',
          keywords: ['Năng động', 'Giao tiếp', 'Tự tin'], examples: ['Thích làm việc nhóm'], dimension_type: 'EI'
        },
        trait_b: {
          id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội',
          description: 'Năng lượng được hướng vào bên trong, thích suy nghĩ độc lập',
          keywords: ['Trầm lặng', 'Suy nghĩ sâu'], examples: ['Thích làm việc một mình'], dimension_type: 'EI'
        }
      },
      {
        dimension: 'SN',
        dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: {
          id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác',
          description: 'Thu nhận thông tin qua giác quan, tập trung vào thực tế',
          keywords: ['Thực tế', 'Chi tiết'], examples: ['Chú ý chi tiết'], dimension_type: 'SN'
        },
        trait_b: {
          id: 'N', name_en: 'Intuition', name_vi: 'Trực giác',
          description: 'Thu nhận thông tin qua trực giác, tập trung vào khả năng',
          keywords: ['Sáng tạo', 'Tương lai'], examples: ['Thích ý tưởng mới'], dimension_type: 'SN'
        }
      },
      {
        dimension: 'TF',
        dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: {
          id: 'T', name_en: 'Thinking', name_vi: 'Tư duy',
          description: 'Quyết định dựa trên logic và lý trí',
          keywords: ['Logic', 'Khách quan'], examples: ['Phân tích dữ liệu'], dimension_type: 'TF'
        },
        trait_b: {
          id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc',
          description: 'Quyết định dựa trên giá trị và cảm xúc',
          keywords: ['Cảm xúc', 'Đồng cảm'], examples: ['Quan tâm người khác'], dimension_type: 'TF'
        }
      },
      {
        dimension: 'JP',
        dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: {
          id: 'J', name_en: 'Judging', name_vi: 'Phán đoán',
          description: 'Thích có kế hoạch và cấu trúc rõ ràng',
          keywords: ['Có tổ chức', 'Kế hoạch'], examples: ['Lên kế hoạch chi tiết'], dimension_type: 'JP'
        },
        trait_b: {
          id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức',
          description: 'Thích sự linh hoạt và tự phát',
          keywords: ['Linh hoạt', 'Tự phát'], examples: ['Thích thay đổi'], dimension_type: 'JP'
        }
      }
    ],
    strengths: [
      { title: 'Lãnh đạo tốt', description: 'Quản lý nhóm hiệu quả.', why_explanation: 'Tư duy logic và quyết đoán.' },
      { title: 'Có tổ chức', description: 'Làm việc khoa học, rõ ràng.', why_explanation: 'Thích kế hoạch, kỷ luật.' }
    ],
    weaknesses: [
      { title: 'Cứng nhắc', description: 'Khó thích nghi với thay đổi.', why_explanation: 'Quá chú trọng quy tắc.', improvement_advice: 'Cởi mở hơn với ý tưởng mới.' }
    ],
    development_advice: ['Lắng nghe ý kiến khác.', 'Linh hoạt hơn khi xử lý vấn đề.'],
    relationship_analysis: {
      interaction_style: 'Thẳng thắn, rõ ràng.',
      improvement_tips: ['Thể hiện sự quan tâm cảm xúc.', 'Kiên nhẫn với người khác.']
    },
    career_guidance: {
      suitable_fields: ['Quản lý', 'Tài chính', 'Hành chính'],
      improvement_skills: ['Kỹ năng mềm', 'Giao tiếp'],
      career_matches: ['Quản lý dự án', 'Trưởng phòng', 'Nhà tổ chức sự kiện']
    },
    work_environment_preferred: 'Môi trường có cấu trúc rõ ràng, mục tiêu cụ thể, đề cao trách nhiệm.',
    work_environment_avoid: 'Môi trường thiếu tổ chức, vai trò không rõ ràng, quá nhiều thay đổi bất ngờ.'
  },
  // INTJ - Nhà kiến trúc sư
  {
    type: 'INTJ',
    name: 'Nhà kiến trúc sư',
    description: 'Chiến lược, độc lập, luôn có kế hoạch rõ ràng cho tương lai.',
    note: 'Thích làm việc một mình, ít chia sẻ cảm xúc.',
    trait_percentages: { E: 25, I: 75, S: 30, N: 70, T: 80, F: 20, J: 70, P: 30 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Tư duy chiến lược', description: 'Lập kế hoạch dài hạn tốt.', why_explanation: 'Nhìn xa trông rộng.' },
      { title: 'Độc lập', description: 'Tự giải quyết vấn đề.', why_explanation: 'Tự tin vào năng lực bản thân.' }
    ],
    weaknesses: [
      { title: 'Ít chia sẻ', description: 'Khó mở lòng với người khác.', why_explanation: 'Thiên về lý trí.', improvement_advice: 'Chủ động giao tiếp nhiều hơn.' }
    ],
    development_advice: ['Chia sẻ ý tưởng với đồng đội.', 'Lắng nghe phản hồi.'],
    relationship_analysis: {
      interaction_style: 'Trầm lặng, sâu sắc.',
      improvement_tips: ['Chủ động kết nối.', 'Thể hiện cảm xúc nhiều hơn.']
    },
    career_guidance: {
      suitable_fields: ['Khoa học', 'Công nghệ', 'Kỹ thuật'],
      improvement_skills: ['Làm việc nhóm', 'Giao tiếp'],
      career_matches: ['Nhà phân tích', 'Kỹ sư', 'Nhà nghiên cứu']
    },
    work_environment_preferred: 'Môi trường độc lập, có định hướng rõ ràng, khuyến khích sáng tạo.',
    work_environment_avoid: 'Môi trường thiếu mục tiêu, nhiều xáo trộn, không tôn trọng ý tưởng mới.'
  },
  // INTP - Nhà tư duy
  {
    type: 'INTP',
    name: 'Nhà tư duy',
    description: 'Phân tích, tò mò, thích khám phá ý tưởng mới.',
    note: 'Thường suy nghĩ sâu sắc, thích tự do sáng tạo.',
    trait_percentages: { E: 20, I: 80, S: 35, N: 65, T: 85, F: 15, J: 35, P: 65 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Phân tích tốt', description: 'Hiểu vấn đề sâu sắc.', why_explanation: 'Tư duy logic mạnh.' },
      { title: 'Sáng tạo', description: 'Đưa ra giải pháp mới.', why_explanation: 'Không ngại thử nghiệm.' }
    ],
    weaknesses: [
      { title: 'Thiếu thực tế', description: 'Đôi khi xa rời thực tiễn.', why_explanation: 'Quá tập trung vào ý tưởng.', improvement_advice: 'Kết hợp lý thuyết với thực hành.' }
    ],
    development_advice: ['Chủ động thực hiện ý tưởng.', 'Học hỏi từ thực tế.'],
    relationship_analysis: {
      interaction_style: 'Dễ gần, thích chia sẻ kiến thức.',
      improvement_tips: ['Lắng nghe cảm xúc người khác.', 'Chia sẻ suy nghĩ rõ ràng.']
    },
    career_guidance: {
      suitable_fields: ['Công nghệ', 'Nghiên cứu', 'Giáo dục'],
      improvement_skills: ['Kỹ năng thực hành', 'Giao tiếp'],
      career_matches: ['Nhà phát triển phần mềm', 'Nhà nghiên cứu', 'Giảng viên']
    },
    work_environment_preferred: 'Môi trường tự do sáng tạo, khuyến khích nghiên cứu và thử nghiệm.',
    work_environment_avoid: 'Môi trường gò bó, ít đổi mới, không khuyến khích ý tưởng.'
  },
  // ENTJ - Nhà chỉ huy
  {
    type: 'ENTJ',
    name: 'Nhà chỉ huy',
    description: 'Quyết đoán, lãnh đạo tốt, luôn hướng tới mục tiêu lớn.',
    note: 'Thích kiểm soát, không ngại thử thách.',
    trait_percentages: { E: 70, I: 30, S: 35, N: 65, T: 85, F: 15, J: 80, P: 20 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Lãnh đạo mạnh mẽ', description: 'Dẫn dắt đội nhóm hiệu quả.', why_explanation: 'Tư duy chiến lược.' },
      { title: 'Quyết đoán', description: 'Dám đưa ra quyết định.', why_explanation: 'Tự tin và rõ ràng.' }
    ],
    weaknesses: [
      { title: 'Khắt khe', description: 'Đôi khi quá cứng rắn.', why_explanation: 'Đặt mục tiêu cao.', improvement_advice: 'Lắng nghe ý kiến khác biệt.' }
    ],
    development_advice: ['Cân bằng giữa công việc và cuộc sống.', 'Thấu hiểu cảm xúc đồng đội.'],
    relationship_analysis: {
      interaction_style: 'Chủ động, truyền cảm hứng.',
      improvement_tips: ['Kiên nhẫn với người khác.', 'Chia sẻ thành công cùng nhóm.']
    },
    career_guidance: {
      suitable_fields: ['Quản lý', 'Kinh doanh', 'Chiến lược'],
      improvement_skills: ['Lắng nghe', 'Quản lý cảm xúc'],
      career_matches: ['Giám đốc', 'Trưởng nhóm', 'Nhà hoạch định chiến lược']
    },
    work_environment_preferred: 'Môi trường cạnh tranh, có mục tiêu lớn, đề cao vai trò lãnh đạo.',
    work_environment_avoid: 'Môi trường thiếu định hướng, không rõ ràng về trách nhiệm.'
  },
  // ENFJ - Nhà lãnh đạo
  {
    type: 'ENFJ',
    name: 'Nhà lãnh đạo',
    description: 'Nhiệt tình, quan tâm đến người khác, giỏi truyền cảm hứng.',
    note: 'Luôn muốn giúp đỡ và kết nối mọi người.',
    trait_percentages: { E: 65, I: 35, S: 35, N: 65, T: 30, F: 70, J: 70, P: 30 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Truyền cảm hứng', description: 'Khích lệ người khác phát triển.', why_explanation: 'Quan tâm và lắng nghe.' },
      { title: 'Giao tiếp tốt', description: 'Dễ tạo thiện cảm.', why_explanation: 'Thấu hiểu cảm xúc.' }
    ],
    weaknesses: [
      { title: 'Dễ lo lắng', description: 'Quan tâm quá nhiều đến người khác.', why_explanation: 'Đặt lợi ích tập thể lên trên.', improvement_advice: 'Chú ý chăm sóc bản thân.' }
    ],
    development_advice: ['Cân bằng giữa cho đi và nhận lại.', 'Tự tin vào quyết định cá nhân.'],
    relationship_analysis: {
      interaction_style: 'Thân thiện, dễ gần.',
      improvement_tips: ['Lắng nghe bản thân.', 'Chia sẻ cảm xúc thật.']
    },
    career_guidance: {
      suitable_fields: ['Giáo dục', 'Tư vấn', 'Quản lý nhân sự'],
      improvement_skills: ['Quản lý cảm xúc', 'Kỹ năng lãnh đạo'],
      career_matches: ['Giáo viên', 'Tư vấn viên', 'Quản lý nhóm']
    },
    work_environment_preferred: 'Môi trường hợp tác, đề cao tinh thần đồng đội, nhiều cơ hội giúp đỡ người khác.',
    work_environment_avoid: 'Môi trường cạnh tranh gay gắt, thiếu sự hỗ trợ lẫn nhau.'
  },
  // INFJ - Nhà vận động
  {
    type: 'INFJ',
    name: 'Nhà vận động',
    description: 'Sâu sắc, lý tưởng, luôn muốn giúp đỡ người khác.',
    note: 'Có trực giác mạnh, sống vì giá trị cá nhân.',
    trait_percentages: { E: 20, I: 80, S: 30, N: 70, T: 30, F: 70, J: 65, P: 35 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Đồng cảm', description: 'Hiểu cảm xúc người khác.', why_explanation: 'Trực giác và cảm xúc mạnh.' },
      { title: 'Kiên định', description: 'Theo đuổi mục tiêu đến cùng.', why_explanation: 'Có lý tưởng sống rõ ràng.' }
    ],
    weaknesses: [
      { title: 'Dễ căng thẳng', description: 'Lo nghĩ nhiều.', why_explanation: 'Nhạy cảm với môi trường.', improvement_advice: 'Thư giãn và chia sẻ nhiều hơn.' }
    ],
    development_advice: ['Chia sẻ cảm xúc với người thân.', 'Tìm kiếm sự hỗ trợ khi cần.'],
    relationship_analysis: {
      interaction_style: 'Chân thành, sâu sắc.',
      improvement_tips: ['Chủ động giao tiếp.', 'Đặt ranh giới cá nhân.']
    },
    career_guidance: {
      suitable_fields: ['Tư vấn', 'Giáo dục', 'Xã hội'],
      improvement_skills: ['Kỹ năng giao tiếp', 'Quản lý cảm xúc'],
      career_matches: ['Nhà tâm lý', 'Giáo viên', 'Nhà hoạt động xã hội']
    },
    work_environment_preferred: 'Môi trường yên tĩnh, nhân văn, khuyến khích phát triển cá nhân.',
    work_environment_avoid: 'Môi trường áp lực cao, thiếu sự đồng cảm.'
  },
  // INFP - Nhà hòa giải
  {
    type: 'INFP',
    name: 'Nhà hòa giải',
    description: 'Nhạy cảm, sáng tạo, sống theo lý tưởng cá nhân.',
    note: 'Luôn muốn tạo ra giá trị tích cực cho cuộc sống.',
    trait_percentages: { E: 15, I: 85, S: 30, N: 70, T: 25, F: 75, J: 35, P: 65 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Sáng tạo', description: 'Có nhiều ý tưởng mới.', why_explanation: 'Tư duy mở và linh hoạt.' },
      { title: 'Đồng cảm', description: 'Dễ chia sẻ cảm xúc.', why_explanation: 'Nhạy cảm với cảm xúc người khác.' }
    ],
    weaknesses: [
      { title: 'Dễ tự ti', description: 'Đôi khi thiếu tự tin.', why_explanation: 'Quá nhạy cảm.', improvement_advice: 'Tập trung vào điểm mạnh bản thân.' }
    ],
    development_advice: ['Tự tin thể hiện ý kiến.', 'Chủ động giao tiếp.'],
    relationship_analysis: {
      interaction_style: 'Nhẹ nhàng, chân thành.',
      improvement_tips: ['Chia sẻ cảm xúc nhiều hơn.', 'Lắng nghe ý kiến khác.']
    },
    career_guidance: {
      suitable_fields: ['Nghệ thuật', 'Giáo dục', 'Tư vấn'],
      improvement_skills: ['Kỹ năng giao tiếp', 'Tự tin thể hiện'],
      career_matches: ['Nhà văn', 'Nhà thiết kế', 'Tư vấn viên']
    },
    work_environment_preferred: 'Môi trường sáng tạo, linh hoạt, tôn trọng giá trị cá nhân.',
    work_environment_avoid: 'Môi trường cứng nhắc, thiếu sự thấu hiểu.'
  },
  // ISFJ - Nhà bảo vệ
  {
    type: 'ISFJ',
    name: 'Nhà bảo vệ',
    description: 'Tận tâm, chu đáo, luôn quan tâm đến người thân.',
    note: 'Thích giúp đỡ, sống vì tập thể.',
    trait_percentages: { E: 25, I: 75, S: 70, N: 30, T: 30, F: 70, J: 75, P: 25 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Tận tâm', description: 'Luôn giúp đỡ người khác.', why_explanation: 'Quan tâm đến tập thể.' },
      { title: 'Kiên nhẫn', description: 'Chịu khó, bền bỉ.', why_explanation: 'Có trách nhiệm cao.' }
    ],
    weaknesses: [
      { title: 'Ngại thay đổi', description: 'Khó thích nghi với cái mới.', why_explanation: 'Thích sự ổn định.', improvement_advice: 'Thử trải nghiệm điều mới.' }
    ],
    development_advice: ['Cởi mở với thay đổi.', 'Chia sẻ cảm xúc nhiều hơn.'],
    relationship_analysis: {
      interaction_style: 'Ân cần, chu đáo.',
      improvement_tips: ['Chủ động giao tiếp.', 'Lắng nghe bản thân.']
    },
    career_guidance: {
      suitable_fields: ['Y tế', 'Giáo dục', 'Hành chính'],
      improvement_skills: ['Kỹ năng thích nghi', 'Giao tiếp'],
      career_matches: ['Y tá', 'Giáo viên', 'Nhân viên hành chính']
    },
    work_environment_preferred: 'Môi trường ổn định, thân thiện, đề cao sự hỗ trợ lẫn nhau.',
    work_environment_avoid: 'Môi trường thay đổi liên tục, thiếu sự quan tâm.'
  },
  // ISFP - Nhà phiêu lưu
  {
    type: 'ISFP',
    name: 'Nhà phiêu lưu',
    description: 'Tự do, linh hoạt, yêu thích trải nghiệm mới.',
    note: 'Sống theo cảm xúc, thích khám phá.',
    trait_percentages: { E: 30, I: 70, S: 65, N: 35, T: 25, F: 75, J: 30, P: 70 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Linh hoạt', description: 'Dễ thích nghi với hoàn cảnh.', why_explanation: 'Không ngại thay đổi.' },
      { title: 'Sáng tạo', description: 'Có nhiều ý tưởng mới.', why_explanation: 'Tư duy mở.' }
    ],
    weaknesses: [
      { title: 'Dễ chán', description: 'Khó kiên trì lâu dài.', why_explanation: 'Thích sự mới mẻ.', improvement_advice: 'Đặt mục tiêu rõ ràng.' }
    ],
    development_advice: ['Kiên trì với mục tiêu.', 'Chủ động lập kế hoạch.'],
    relationship_analysis: {
      interaction_style: 'Thân thiện, dễ gần.',
      improvement_tips: ['Chia sẻ cảm xúc.', 'Lắng nghe ý kiến khác.']
    },
    career_guidance: {
      suitable_fields: ['Nghệ thuật', 'Du lịch', 'Thiết kế'],
      improvement_skills: ['Lập kế hoạch', 'Kỹ năng giao tiếp'],
      career_matches: ['Nhà thiết kế', 'Hướng dẫn viên', 'Nhiếp ảnh gia']
    },
    work_environment_preferred: 'Môi trường linh hoạt, sáng tạo, nhiều trải nghiệm mới.',
    work_environment_avoid: 'Môi trường gò bó, ít cơ hội thể hiện bản thân.'
  },
  // ESFJ - Nhà ngoại giao
  {
    type: 'ESFJ',
    name: 'Nhà ngoại giao',
    description: 'Hòa đồng, quan tâm đến người khác, thích giúp đỡ cộng đồng.',
    note: 'Luôn muốn tạo môi trường hòa thuận.',
    trait_percentages: { E: 70, I: 30, S: 65, N: 35, T: 30, F: 70, J: 70, P: 30 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Hòa đồng', description: 'Dễ kết bạn, thân thiện.', why_explanation: 'Quan tâm đến tập thể.' },
      { title: 'Tận tâm', description: 'Luôn giúp đỡ người khác.', why_explanation: 'Sống vì cộng đồng.' }
    ],
    weaknesses: [
      { title: 'Dễ lo lắng', description: 'Quan tâm quá nhiều đến ý kiến người khác.', why_explanation: 'Muốn làm hài lòng mọi người.', improvement_advice: 'Tự tin vào bản thân.' }
    ],
    development_advice: ['Chăm sóc bản thân nhiều hơn.', 'Tự tin thể hiện ý kiến.'],
    relationship_analysis: {
      interaction_style: 'Thân thiện, hòa nhã.',
      improvement_tips: ['Lắng nghe bản thân.', 'Chia sẻ cảm xúc thật.']
    },
    career_guidance: {
      suitable_fields: ['Giáo dục', 'Y tế', 'Dịch vụ khách hàng'],
      improvement_skills: ['Kỹ năng giao tiếp', 'Quản lý cảm xúc'],
      career_matches: ['Giáo viên', 'Điều dưỡng', 'Chăm sóc khách hàng']
    },
    work_environment_preferred: 'Môi trường thân thiện, hợp tác, nhiều hoạt động nhóm.',
    work_environment_avoid: 'Môi trường cạnh tranh, thiếu sự hỗ trợ.'
  },
  // ESFP - Nhà giải trí
  {
    type: 'ESFP',
    name: 'Nhà giải trí',
    description: 'Năng động, vui vẻ, thích mang lại tiếng cười cho mọi người.',
    note: 'Sống hết mình cho hiện tại.',
    trait_percentages: { E: 80, I: 20, S: 70, N: 30, T: 25, F: 75, J: 30, P: 70 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Năng động', description: 'Luôn mang lại không khí vui vẻ.', why_explanation: 'Yêu thích hoạt động.' },
      { title: 'Thích ứng nhanh', description: 'Dễ hòa nhập môi trường mới.', why_explanation: 'Linh hoạt, cởi mở.' }
    ],
    weaknesses: [
      { title: 'Dễ xao nhãng', description: 'Khó tập trung lâu dài.', why_explanation: 'Thích sự mới mẻ.', improvement_advice: 'Lên kế hoạch rõ ràng.' }
    ],
    development_advice: ['Kiên trì với mục tiêu.', 'Chủ động lập kế hoạch.'],
    relationship_analysis: {
      interaction_style: 'Vui vẻ, hòa đồng.',
      improvement_tips: ['Lắng nghe nhiều hơn.', 'Tôn trọng ý kiến khác biệt.']
    },
    career_guidance: {
      suitable_fields: ['Nghệ thuật', 'Sự kiện', 'Du lịch'],
      improvement_skills: ['Lập kế hoạch', 'Kỹ năng giao tiếp'],
      career_matches: ['MC', 'Diễn viên', 'Hướng dẫn viên']
    },
    work_environment_preferred: 'Môi trường năng động, vui vẻ, nhiều cơ hội giao tiếp.',
    work_environment_avoid: 'Môi trường đơn điệu, ít tương tác xã hội.'
  },
  // ISTJ - Nhà hậu cần
  {
    type: 'ISTJ',
    name: 'Nhà hậu cần',
    description: 'Ngăn nắp, trách nhiệm, luôn hoàn thành công việc đúng hạn.',
    note: 'Đề cao sự ổn định và truyền thống.',
    trait_percentages: { E: 20, I: 80, S: 75, N: 25, T: 70, F: 30, J: 80, P: 20 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Trách nhiệm', description: 'Luôn hoàn thành nhiệm vụ.', why_explanation: 'Tính kỷ luật cao.' },
      { title: 'Ngăn nắp', description: 'Làm việc có hệ thống.', why_explanation: 'Thích sự rõ ràng.' }
    ],
    weaknesses: [
      { title: 'Bảo thủ', description: 'Khó tiếp nhận cái mới.', why_explanation: 'Thích sự ổn định.', improvement_advice: 'Cởi mở với thay đổi.' }
    ],
    development_advice: ['Thử nghiệm điều mới.', 'Chia sẻ ý kiến với nhóm.'],
    relationship_analysis: {
      interaction_style: 'Điềm tĩnh, đáng tin cậy.',
      improvement_tips: ['Chủ động giao tiếp.', 'Lắng nghe ý kiến khác.']
    },
    career_guidance: {
      suitable_fields: ['Hành chính', 'Kế toán', 'Quản lý'],
      improvement_skills: ['Kỹ năng mềm', 'Làm việc nhóm'],
      career_matches: ['Nhân viên hành chính', 'Kế toán', 'Quản lý kho']
    },
    work_environment_preferred: 'Môi trường ổn định, có quy trình rõ ràng, đề cao trách nhiệm.',
    work_environment_avoid: 'Môi trường hỗn loạn, thiếu quy tắc.'
  },
  // ISTP - Nhà kỹ thuật
  {
    type: 'ISTP',
    name: 'Nhà kỹ thuật',
    description: 'Thực tế, linh hoạt, thích tìm hiểu cách mọi thứ hoạt động.',
    note: 'Ưa thích tự do, không thích bị kiểm soát.',
    trait_percentages: { E: 30, I: 70, S: 70, N: 30, T: 75, F: 25, J: 35, P: 65 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Thực tế', description: 'Giải quyết vấn đề nhanh.', why_explanation: 'Tư duy logic, linh hoạt.' },
      { title: 'Linh hoạt', description: 'Dễ thích nghi.', why_explanation: 'Không ngại thay đổi.' }
    ],
    weaknesses: [
      { title: 'Ít kiên nhẫn', description: 'Dễ chán với việc lặp lại.', why_explanation: 'Thích sự mới mẻ.', improvement_advice: 'Kiên trì với mục tiêu.' }
    ],
    development_advice: ['Kiên nhẫn hơn.', 'Chủ động chia sẻ ý tưởng.'],
    relationship_analysis: {
      interaction_style: 'Thẳng thắn, thực tế.',
      improvement_tips: ['Lắng nghe cảm xúc.', 'Chia sẻ nhiều hơn.']
    },
    career_guidance: {
      suitable_fields: ['Kỹ thuật', 'Công nghệ', 'Cơ khí'],
      improvement_skills: ['Làm việc nhóm', 'Kỹ năng giao tiếp'],
      career_matches: ['Kỹ sư', 'Thợ máy', 'Nhà phát triển sản phẩm']
    },
    work_environment_preferred: 'Môi trường thực tế, tự do thử nghiệm, ít bị kiểm soát.',
    work_environment_avoid: 'Môi trường quá nhiều quy định, thiếu thực tiễn.'
  },
  // ESTP - Nhà khởi nghiệp
  {
    type: 'ESTP',
    name: 'Nhà khởi nghiệp',
    description: 'Năng động, quyết đoán, thích thử thách và hành động.',
    note: 'Luôn tìm kiếm cơ hội mới.',
    trait_percentages: { E: 75, I: 25, S: 70, N: 30, T: 70, F: 30, J: 35, P: 65 },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: 'Quyết đoán', description: 'Dám nghĩ dám làm.', why_explanation: 'Tự tin, năng động.' },
      { title: 'Thích ứng nhanh', description: 'Xử lý tình huống tốt.', why_explanation: 'Linh hoạt, thực tế.' }
    ],
    weaknesses: [
      { title: 'Nóng vội', description: 'Đôi khi thiếu kiên nhẫn.', why_explanation: 'Thích hành động nhanh.', improvement_advice: 'Cân nhắc kỹ trước khi quyết định.' }
    ],
    development_advice: ['Kiên nhẫn hơn.', 'Lắng nghe ý kiến nhóm.'],
    relationship_analysis: {
      interaction_style: 'Nhiệt tình, chủ động.',
      improvement_tips: ['Kiểm soát cảm xúc.', 'Tôn trọng ý kiến khác biệt.']
    },
    career_guidance: {
      suitable_fields: ['Kinh doanh', 'Bán hàng', 'Sự kiện'],
      improvement_skills: ['Lập kế hoạch', 'Kỹ năng giao tiếp'],
      career_matches: ['Doanh nhân', 'Nhân viên kinh doanh', 'Tổ chức sự kiện']
    },
    work_environment_preferred: 'Môi trường năng động, nhiều thử thách, đề cao hành động.',
    work_environment_avoid: 'Môi trường nhàm chán, ít cơ hội thể hiện bản thân.'
  }
];

// Tạo dữ liệu cho các loại MBTI còn lại với template cơ bản
const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 
  'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTP', 'ISTJ', 'ESTP'
];

const typeNames = {
  'INTJ': 'Nhà kiến trúc sư', 'INTP': 'Nhà tư duy', 'ENTJ': 'Nhà chỉ huy', 'ENTP': 'Nhà tranh luận',
  'INFJ': 'Nhà vận động', 'INFP': 'Nhà hòa giải', 'ENFJ': 'Nhà lãnh đạo', 
  'ISFJ': 'Nhà bảo vệ', 'ISFP': 'Nhà phiêu lưu', 'ESFJ': 'Nhà ngoại giao', 'ESFP': 'Nhà giải trí',
  'ISTP': 'Nhà kỹ thuật', 'ISTJ': 'Nhà hậu cần', 'ESTP': 'Nhà khởi nghiệp'
};

// Tạo dữ liệu template cho các loại còn lại
mbtiTypes.forEach(type => {
  const traits = type.split('');
  personalityData.push({
    type: type,
    name: typeNames[type],
    description: `${type} là một loại tính cách độc đáo với những đặc điểm riêng biệt. Họ có cách tiếp cận cuộc sống và công việc theo phong cách ${typeNames[type].toLowerCase()}.`,
    note: `Người có loại tính cách ${type} thường có những đặc điểm nổi bật phù hợp với xu hướng ${traits.join(', ')}.`,
    trait_percentages: {
      E: traits[0] === 'E' ? 70 : 30, I: traits[0] === 'I' ? 70 : 30,
      S: traits[1] === 'S' ? 70 : 30, N: traits[1] === 'N' ? 70 : 30,
      T: traits[2] === 'T' ? 70 : 30, F: traits[2] === 'F' ? 70 : 30,
      J: traits[3] === 'J' ? 70 : 30, P: traits[3] === 'P' ? 70 : 30
    },
    dimensions: [
      {
        dimension: 'EI', dimension_name_vi: 'Xu hướng liên quan đến Năng lượng',
        trait_a: { id: 'E', name_en: 'Extraversion', name_vi: 'Hướng ngoại', description: 'Năng lượng hướng ngoại', keywords: ['Năng động'], examples: ['Giao tiếp'], dimension_type: 'EI' },
        trait_b: { id: 'I', name_en: 'Introversion', name_vi: 'Hướng nội', description: 'Năng lượng hướng nội', keywords: ['Trầm lặng'], examples: ['Suy nghĩ'], dimension_type: 'EI' }
      },
      {
        dimension: 'SN', dimension_name_vi: 'Xu hướng liên quan đến Thu nhận thông tin',
        trait_a: { id: 'S', name_en: 'Sensing', name_vi: 'Cảm giác', description: 'Thu nhận qua giác quan', keywords: ['Thực tế'], examples: ['Chi tiết'], dimension_type: 'SN' },
        trait_b: { id: 'N', name_en: 'Intuition', name_vi: 'Trực giác', description: 'Thu nhận qua trực giác', keywords: ['Sáng tạo'], examples: ['Ý tưởng'], dimension_type: 'SN' }
      },
      {
        dimension: 'TF', dimension_name_vi: 'Xu hướng liên quan đến Ra quyết định',
        trait_a: { id: 'T', name_en: 'Thinking', name_vi: 'Tư duy', description: 'Quyết định bằng logic', keywords: ['Logic'], examples: ['Phân tích'], dimension_type: 'TF' },
        trait_b: { id: 'F', name_en: 'Feeling', name_vi: 'Cảm xúc', description: 'Quyết định bằng cảm xúc', keywords: ['Đồng cảm'], examples: ['Quan tâm'], dimension_type: 'TF' }
      },
      {
        dimension: 'JP', dimension_name_vi: 'Xu hướng liên quan đến Nguyên tắc sống',
        trait_a: { id: 'J', name_en: 'Judging', name_vi: 'Phán đoán', description: 'Thích kế hoạch', keywords: ['Tổ chức'], examples: ['Kế hoạch'], dimension_type: 'JP' },
        trait_b: { id: 'P', name_en: 'Perceiving', name_vi: 'Nhận thức', description: 'Thích linh hoạt', keywords: ['Linh hoạt'], examples: ['Tự phát'], dimension_type: 'JP' }
      }
    ],
    strengths: [
      { title: `Điểm mạnh của ${type}`, description: `Có những ưu điểm đặc trưng của ${typeNames[type]}`, why_explanation: `Do có xu hướng ${traits.join(', ')} phù hợp` }
    ],
    weaknesses: [
      { title: `Điểm yếu của ${type}`, description: `Cần cải thiện một số khía cạnh`, why_explanation: `Do xu hướng ${traits.join(', ')} có thể gây ra`, improvement_advice: 'Cần phát triển cân bằng các khía cạnh khác' }
    ],
    development_advice: [`Phát triển kỹ năng phù hợp với ${typeNames[type]}`, 'Cân bằng các xu hướng tính cách'],
    relationship_analysis: {
      interaction_style: `${type} có cách tương tác đặc trưng của ${typeNames[type]}`,
      improvement_tips: ['Phát triển kỹ năng giao tiếp', 'Hiểu rõ hơn về người khác']
    },
    career_guidance: {
      suitable_fields: ['Lĩnh vực phù hợp với tính cách', 'Công việc phát huy điểm mạnh'],
      improvement_skills: ['Kỹ năng cần thiết cho nghề nghiệp', 'Phát triển năng lực chuyên môn'],
      career_matches: [`Nghề nghiệp phù hợp với ${typeNames[type]}`]
    },
    work_environment_preferred: 'Môi trường phù hợp với tính cách này: linh hoạt, tôn trọng cá nhân, có cơ hội phát triển bản thân.',
    work_environment_avoid: 'Môi trường không phù hợp: quá cứng nhắc, thiếu sáng tạo, không tôn trọng ý kiến cá nhân.'
  });
});

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing PersonalityDetailInfo data...');
    await PersonalityDetailInfo.deleteMany({});

    // Insert all personality data
    console.log('Inserting all 16 MBTI personality types...');
    await PersonalityDetailInfo.insertMany(personalityData);
    console.log(`Successfully inserted ${personalityData.length} personality types`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase(); 