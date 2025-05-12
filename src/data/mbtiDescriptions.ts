export interface MBTIDescriptionDetail {
  overview: string;
  traits: string[];
  values: string[];
  communication: string;
  relationships: string;
  advice: string;
}

export const mbtiDescriptions: Record<string, MBTIDescriptionDetail> = {
  INTJ: {
    overview: 'INTJ là những người có tầm nhìn chiến lược, tư duy logic và luôn hướng tới sự hoàn hảo. Họ độc lập, quyết đoán và thường có kế hoạch rõ ràng cho tương lai.',
    traits: [
      'Tư duy chiến lược, logic',
      'Độc lập, tự chủ',
      'Có tiêu chuẩn cao',
      'Thích phân tích và tối ưu hóa',
    ],
    values: [
      'Hiệu quả',
      'Kiến thức',
      'Sự phát triển bản thân',
    ],
    communication: 'INTJ giao tiếp ngắn gọn, đi thẳng vào vấn đề và thích trao đổi ý tưởng sâu sắc. Họ không thích vòng vo và thường tránh các cuộc trò chuyện xã giao không cần thiết.',
    relationships: 'Trong các mối quan hệ, INTJ trung thành nhưng có thể khó gần. Họ cần thời gian để mở lòng và thường tìm kiếm những người bạn, đối tác có cùng chí hướng.',
    advice: 'Hãy học cách linh hoạt hơn, lắng nghe cảm xúc của bản thân và người khác. Đừng quá cầu toàn và hãy tận hưởng hiện tại.',
  },
  ENFP: {
    overview: 'ENFP là những người truyền cảm hứng, sáng tạo và nhiệt huyết. Họ yêu thích sự tự do, khám phá và luôn tìm kiếm ý nghĩa trong cuộc sống.',
    traits: [
      'Nhiệt tình, sáng tạo',
      'Dễ thích nghi',
      'Thấu cảm, giàu cảm xúc',
      'Truyền cảm hứng cho người khác',
    ],
    values: [
      'Tự do',
      'Sự phát triển cá nhân',
      'Kết nối cảm xúc',
    ],
    communication: 'ENFP giao tiếp cởi mở, thân thiện và giàu cảm xúc. Họ thích chia sẻ ý tưởng, cảm xúc và truyền động lực cho người khác.',
    relationships: 'ENFP dễ kết bạn, quan tâm sâu sắc đến người thân và luôn tìm kiếm sự đồng cảm trong các mối quan hệ.',
    advice: 'Hãy học cách tập trung vào mục tiêu, quản lý thời gian tốt hơn và kiên trì với những gì đã chọn.',
  },
  ESTJ: {
    overview: 'ESTJ là những người thực tế, có khả năng tổ chức và quản lý xuất sắc. Họ thích sự trật tự, kỷ luật và luôn hướng tới hiệu quả.',
    traits: [
      'Thực tế, quyết đoán',
      'Tổ chức tốt',
      'Lãnh đạo tự nhiên',
      'Trung thực, đáng tin cậy',
    ],
    values: [
      'Kỷ luật',
      'Hiệu quả',
      'Trách nhiệm',
    ],
    communication: 'ESTJ giao tiếp rõ ràng, thẳng thắn và thích giải quyết vấn đề một cách trực tiếp.',
    relationships: 'Trong các mối quan hệ, ESTJ trung thành, bảo vệ người thân nhưng đôi khi có thể quá cứng nhắc.',
    advice: 'Hãy linh hoạt hơn, lắng nghe cảm xúc của người khác và chấp nhận sự khác biệt.',
  },
}; 