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
    description: 'ENFP là những người năng động, sáng tạo và luôn tràn đầy nhiệt huyết. Họ yêu thích khám phá những khả năng mới và truyền cảm hứng cho người khác.',
    note: 'Người có loại tính cách ENFP thường rất năng động, yêu thích sự tự do và không thích bị ràng buộc bởi các quy tắc cứng nhắc.',
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
      { title: 'Sáng tạo và đổi mới', description: 'Có khả năng nghĩ ra ý tưởng mới', why_explanation: 'Do xu hướng Trực giác mạnh' },
      { title: 'Giao tiếp xuất sắc', description: 'Truyền đạt ý tưởng rõ ràng', why_explanation: 'Tính Hướng ngoại kết hợp Cảm xúc' }
    ],
    weaknesses: [
      { title: 'Khó tập trung lâu dài', description: 'Mất hứng thú với công việc lặp lại', why_explanation: 'Xu hướng Trực giác và Nhận thức', improvement_advice: 'Chia nhỏ công việc thành các nhiệm vụ nhỏ' }
    ],
    development_advice: ['Phát triển kỹ năng quản lý thời gian', 'Học cách tập trung lâu hơn'],
    relationship_analysis: {
      interaction_style: 'ENFP thường là những người bạn tuyệt vời và rất dễ gần',
      improvement_tips: ['Học cách lắng nghe tích cực', 'Dành thời gian chất lượng với bạn bè']
    },
    career_guidance: {
      suitable_fields: ['Marketing và Truyền thông', 'Giáo dục và Đào tạo'],
      improvement_skills: ['Kỹ năng quản lý dự án', 'Khả năng phân tích dữ liệu'],
      career_matches: ['Chuyên viên Marketing', 'Nhà tư vấn nghề nghiệp']
    }
  },

  // ESTJ - Người điều hành
  {
    type: 'ESTJ',
    name: 'Người điều hành',
    description: 'ESTJ là những người lãnh đạo tự nhiên, có tổ chức và thích kiểm soát. Họ có khả năng quản lý tốt và luôn hướng tới hiệu quả trong công việc.',
    note: 'Người có loại tính cách ESTJ thường rất có trách nhiệm, thích trật tự và có khả năng lãnh đạo xuất sắc.',
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
      { title: 'Khả năng lãnh đạo', description: 'Có khả năng điều hành và quản lý tốt', why_explanation: 'Do xu hướng Tư duy và Phán đoán mạnh' },
      { title: 'Có tổ chức', description: 'Làm việc có hệ thống và hiệu quả', why_explanation: 'Xu hướng Cảm giác và Phán đoán' }
    ],
    weaknesses: [
      { title: 'Cứng nhắc', description: 'Khó thích nghi với thay đổi', why_explanation: 'Xu hướng Phán đoán quá mạnh', improvement_advice: 'Học cách linh hoạt hơn trong các tình huống mới' }
    ],
    development_advice: ['Phát triển kỹ năng lắng nghe', 'Học cách linh hoạt hơn'],
    relationship_analysis: {
      interaction_style: 'ESTJ thường là những người lãnh đạo mạnh mẽ nhưng cần học cách đồng cảm',
      improvement_tips: ['Lắng nghe ý kiến người khác', 'Thể hiện sự quan tâm đến cảm xúc']
    },
    career_guidance: {
      suitable_fields: ['Quản lý và Điều hành', 'Tài chính và Ngân hàng'],
      improvement_skills: ['Kỹ năng đồng cảm', 'Khả năng thích nghi'],
      career_matches: ['Giám đốc điều hành', 'Quản lý dự án']
    }
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
    }
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