export interface CareerGuidanceDetail {
  personalityType: string;
  overview: string;
  workEnvironment: {
    preferred: string;
    avoid: string;
  };
  idealRoles: Array<{
    category: string;
    roles: string[];
    description: string;
  }>;
  keyStrengths: string[];
  developmentAreas: string[];
  careerTips: string[];
  salary_ranges: {
    entry: string;
    mid: string;
    senior: string;
  };
  industry_outlook: string;
}

export const careerGuidanceData: Record<string, CareerGuidanceDetail> = {
  INTJ: {
    personalityType: "INTJ",
    overview: "INTJ là những chiến lược gia thiên bẩm, thích làm việc độc lập và tập trung vào các dự án dài hạn. Họ xuất sắc trong việc phân tích hệ thống và tạo ra các giải pháp sáng tạo.",
    workEnvironment: {
      preferred: "Môi trường yên tĩnh, độc lập, ít gián đoạn. Có quyền tự chủ cao và được làm việc với các vấn đề phức tạp.",
      avoid: "Môi trường ồn ào, quá nhiều cuộc họp, vi quản lý hoặc công việc lặp đi lặp lại."
    },
    idealRoles: [
      {
        category: "Công nghệ & IT",
        roles: ["Kỹ sư phần mềm", "Kiến trúc sư hệ thống", "Chuyên gia an ninh mạng", "Data Scientist"],
        description: "Phát triển và thiết kế các hệ thống phức tạp, yêu cầu tư duy logic và khả năng giải quyết vấn đề."
      },
      {
        category: "Tài chính & Phân tích",
        roles: ["Phân tích viên tài chính", "Chuyên gia đầu tư", "Chuyên gia rủi ro", "Quản lý quỹ"],
        description: "Phân tích dữ liệu tài chính, dự báo xu hướng và đưa ra chiến lược đầu tư."
      },
      {
        category: "Nghiên cứu & Khoa học",
        roles: ["Nhà nghiên cứu", "Khoa học gia", "Giảng viên đại học", "Chuyên gia R&D"],
        description: "Thực hiện nghiên cứu sâu, phát triển lý thuyết mới và ứng dụng khoa học."
      },
      {
        category: "Tư vấn & Chiến lược",
        roles: ["Tư vấn quản lý", "Chiến lược gia doanh nghiệp", "Chuyên gia quy trình", "Business Analyst"],
        description: "Phân tích và cải tiến quy trình kinh doanh, đưa ra các giải pháp chiến lược."
      }
    ],
    keyStrengths: [
      "Tư duy chiến lược và nhìn xa trông rộng",
      "Khả năng phân tích và giải quyết vấn đề phức tạp",
      "Làm việc độc lập hiệu quả",
      "Có tầm nhìn dài hạn và khả năng lập kế hoạch"
    ],
    developmentAreas: [
      "Kỹ năng giao tiếp và thuyết trình",
      "Làm việc nhóm và lãnh đạo team",
      "Quản lý thời gian và deadline",
      "Kỹ năng networking và xây dựng mối quan hệ"
    ],
    careerTips: [
      "Tìm kiếm các vị trí cho phép làm việc độc lập và sáng tạo",
      "Phát triển kỹ năng giao tiếp để thuyết phục được ý tưởng của mình",
      "Tham gia các dự án có tầm ảnh hưởng lớn và dài hạn",
      "Liên tục học hỏi và cập nhật kiến thức chuyên môn"
    ],
    salary_ranges: {
      entry: "15-25 triệu VNĐ/tháng",
      mid: "25-45 triệu VNĐ/tháng", 
      senior: "45-80+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất tích cực, đặc biệt trong các lĩnh vực công nghệ, tài chính và tư vấn chiến lược."
  },

  INTP: {
    personalityType: "INTP",
    overview: "INTP là những nhà tư tưởng và nhà phát minh, thích khám phá ý tưởng mới và giải quyết các vấn đề lý thuyết. Họ xuất sắc trong nghiên cứu và phát triển các khái niệm mới.",
    workEnvironment: {
      preferred: "Môi trường linh hoạt, ít ràng buộc, được tự do khám phá và thử nghiệm. Có thời gian suy nghĩ và làm việc theo nhịp độ riêng.",
      avoid: "Môi trường cứng nhắc, quá nhiều deadline gấp, áp lực xã hội hoặc công việc hành chính nhiều."
    },
    idealRoles: [
      {
        category: "Nghiên cứu & Phát triển",
        roles: ["Nhà nghiên cứu khoa học", "Kỹ sư R&D", "Nhà phát minh", "Chuyên gia AI/ML"],
        description: "Khám phá các lý thuyết mới, phát triển công nghệ và giải pháp sáng tạo."
      },
      {
        category: "Công nghệ & Lập trình",
        roles: ["Software Developer", "Data Scientist", "Kiến trúc sư phần mềm", "DevOps Engineer"],
        description: "Thiết kế và phát triển các hệ thống phần mềm phức tạp, làm việc với công nghệ mới."
      },
      {
        category: "Học thuật & Giáo dục",
        roles: ["Giảng viên đại học", "Nhà nghiên cứu", "Chuyên gia đào tạo", "Tác giả sách chuyên môn"],
        description: "Giảng dạy và nghiên cứu trong các lĩnh vực chuyên môn sâu."
      },
      {
        category: "Tư vấn & Phân tích",
        roles: ["Tư vấn kỹ thuật", "System Analyst", "Chuyên gia tối ưu hóa", "Strategy Consultant"],
        description: "Phân tích và cải thiện các hệ thống, quy trình phức tạp."
      }
    ],
    keyStrengths: [
      "Tư duy logic và phân tích xuất sắc",
      "Khả năng học hỏi và thích nghi nhanh",
      "Sáng tạo trong việc giải quyết vấn đề",
      "Làm việc độc lập hiệu quả"
    ],
    developmentAreas: [
      "Kỹ năng giao tiếp và thuyết trình",
      "Quản lý dự án và deadline",
      "Kỹ năng lãnh đạo và làm việc nhóm",
      "Khả năng thương mại hóa ý tưởng"
    ],
    careerTips: [
      "Tìm kiếm các vị trí nghiên cứu và phát triển",
      "Phát triển kỹ năng giao tiếp để chia sẻ ý tưởng hiệu quả",
      "Tham gia các dự án sáng tạo và đầy thử thách",
      "Cân bằng giữa lý thuyết và ứng dụng thực tế"
    ],
    salary_ranges: {
      entry: "12-20 triệu VNĐ/tháng",
      mid: "20-40 triệu VNĐ/tháng",
      senior: "40-70+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực, đặc biệt trong lĩnh vực công nghệ, AI, và nghiên cứu khoa học."
  },

  ENTJ: {
    personalityType: "ENTJ",
    overview: "ENTJ là những nhà lãnh đạo bẩm sinh, có khả năng tổ chức và điều hành xuất sắc. Họ thích thử thách và có tầm nhìn chiến lược để dẫn dắt tổ chức đến thành công.",
    workEnvironment: {
      preferred: "Môi trường năng động, thử thách, có cơ hội lãnh đạo và ra quyết định. Được trao quyền và có tầm ảnh hưởng lớn.",
      avoid: "Vị trí thụ động, ít quyền hạn, môi trường quan liêu hoặc thiếu cơ hội thăng tiến."
    },
    idealRoles: [
      {
        category: "Lãnh đạo & Quản lý",
        roles: ["CEO/Giám đốc", "COO", "Giám đốc vận hành", "Team Lead", "Project Manager"],
        description: "Lãnh đạo và điều hành tổ chức, đưa ra quyết định chiến lược và quản lý team."
      },
      {
        category: "Kinh doanh & Bán hàng",
        roles: ["Giám đốc kinh doanh", "Account Manager", "Business Development", "Sales Director"],
        description: "Phát triển kinh doanh, mở rộng thị trường và quản lý mối quan hệ khách hàng."
      },
      {
        category: "Tư vấn & Chiến lược",
        roles: ["Management Consultant", "Strategy Director", "Business Analyst", "M&A Specialist"],
        description: "Tư vấn chiến lược cho doanh nghiệp và thực hiện các dự án chuyển đổi."
      },
      {
        category: "Tài chính & Đầu tư",
        roles: ["Investment Manager", "Fund Manager", "CFO", "Financial Director"],
        description: "Quản lý tài chính, đầu tư và đưa ra các quyết định tài chính chiến lược."
      }
    ],
    keyStrengths: [
      "Khả năng lãnh đạo và truyền cảm hứng",
      "Tư duy chiến lược và nhìn xa trông rộng",
      "Kỹ năng ra quyết định nhanh và chính xác",
      "Khả năng tổ chức và điều phối hiệu quả"
    ],
    developmentAreas: [
      "Kỹ năng lắng nghe và empathy",
      "Quản lý stress và cân bằng cuộc sống",
      "Patience với những người làm việc chậm hơn",
      "Kỹ năng delegate hiệu quả"
    ],
    careerTips: [
      "Tìm kiếm các vị trí lãnh đạo và có tầm ảnh hưởng",
      "Phát triển kỹ năng emotional intelligence",
      "Xây dựng network mạnh trong ngành",
      "Liên tục học hỏi về quản lý và lãnh đạo"
    ],
    salary_ranges: {
      entry: "18-30 triệu VNĐ/tháng",
      mid: "30-60 triệu VNĐ/tháng",
      senior: "60-150+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất tích cực, đặc biệt trong các vị trí quản lý cấp cao và lãnh đạo doanh nghiệp."
  },

  ENTP: {
    personalityType: "ENTP",
    overview: "ENTP là những nhà đổi mới và doanh nhân, thích khám phá cơ hội mới và tạo ra sự thay đổi. Họ xuất sắc trong việc tạo ra ý tưởng và thuyết phục người khác.",
    workEnvironment: {
      preferred: "Môi trường sáng tạo, linh hoạt, nhiều thay đổi và cơ hội. Được tự do thử nghiệm và đổi mới.",
      avoid: "Công việc lặp đi lặp lại, môi trường cứng nhắc, quá nhiều chi tiết hành chính."
    },
    idealRoles: [
      {
        category: "Khởi nghiệp & Đổi mới",
        roles: ["Entrepreneur", "Startup Founder", "Innovation Manager", "Product Manager"],
        description: "Tạo ra các sản phẩm mới, dịch vụ mới và dẫn dắt sự đổi mới trong tổ chức."
      },
      {
        category: "Marketing & Truyền thông",
        roles: ["Creative Director", "Marketing Manager", "Brand Manager", "PR Manager"],
        description: "Phát triển chiến lược marketing sáng tạo và xây dựng thương hiệu."
      },
      {
        category: "Tư vấn & Bán hàng",
        roles: ["Business Development", "Sales Manager", "Consultant", "Account Executive"],
        description: "Phát triển kinh doanh mới, tư vấn giải pháp và quản lý mối quan hệ khách hàng."
      },
      {
        category: "Công nghệ & Phát triển",
        roles: ["Product Owner", "UX Designer", "Tech Lead", "Solutions Architect"],
        description: "Thiết kế và phát triển các giải pháp công nghệ mới."
      }
    ],
    keyStrengths: [
      "Khả năng sáng tạo và đổi mới",
      "Kỹ năng giao tiếp và thuyết phục",
      "Tư duy nhanh nhạy và linh hoạt",
      "Khả năng nhìn thấy cơ hội mới"
    ],
    developmentAreas: [
      "Kỹ năng quản lý thời gian và tổ chức",
      "Follow-through và hoàn thành dự án",
      "Chi tiết và chính xác trong công việc",
      "Patience với quá trình dài hạn"
    ],
    careerTips: [
      "Tìm kiếm các vị trí sáng tạo và đầy thử thách",
      "Phát triển kỹ năng quản lý dự án",
      "Tham gia vào các startup hoặc dự án đổi mới",
      "Xây dựng network rộng trong nhiều lĩnh vực"
    ],
    salary_ranges: {
      entry: "15-25 triệu VNĐ/tháng",
      mid: "25-45 triệu VNĐ/tháng",
      senior: "45-80+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực, đặc biệt trong các lĩnh vực startup, marketing và công nghệ."
  },

  INFJ: {
    personalityType: "INFJ",
    overview: "INFJ là những người có tầm nhìn sâu sắc và mong muốn tạo ra tác động tích cực. Họ xuất sắc trong việc hiểu con người và tạo ra những thay đổi có ý nghĩa.",
    workEnvironment: {
      preferred: "Môi trường yên tĩnh, có ý nghĩa, cho phép giúp đỡ người khác. Có thời gian để suy nghĩ và làm việc sâu.",
      avoid: "Môi trường quá ồn ào, căng thẳng, xung đột nhiều hoặc thiếu ý nghĩa."
    },
    idealRoles: [
      {
        category: "Tư vấn & Hỗ trợ",
        roles: ["Tâm lý học gia", "Tư vấn viên", "Life Coach", "HR Business Partner"],
        description: "Hỗ trợ và phát triển con người, giải quyết các vấn đề tâm lý và hành vi."
      },
      {
        category: "Giáo dục & Đào tạo",
        roles: ["Giảng viên", "Chuyên gia đào tạo", "Curriculum Designer", "Educational Consultant"],
        description: "Giảng dạy, phát triển chương trình học và hướng dẫn người khác."
      },
      {
        category: "Sáng tạo & Nội dung",
        roles: ["Writer", "Content Creator", "UX Designer", "Creative Director"],
        description: "Tạo ra nội dung có ý nghĩa và thiết kế trải nghiệm người dùng."
      },
      {
        category: "Phi lợi nhuận & Xã hội",
        roles: ["Program Manager", "Social Worker", "NGO Director", "Policy Analyst"],
        description: "Làm việc vì các mục tiêu xã hội và tạo ra tác động tích cực."
      }
    ],
    keyStrengths: [
      "Khả năng hiểu sâu về con người",
      "Tầm nhìn dài hạn và ý nghĩa",
      "Kỹ năng giao tiếp empathy",
      "Sáng tạo và tư duy độc đáo"
    ],
    developmentAreas: [
      "Kỹ năng assertiveness và đàm phán",
      "Quản lý stress và burnout",
      "Networking và xây dựng mối quan hệ",
      "Business acumen và tư duy thương mại"
    ],
    careerTips: [
      "Tìm kiếm công việc có ý nghĩa và tác động tích cực",
      "Phát triển kỹ năng leadership nhẹ nhàng",
      "Cân bằng giữa lý tưởng và thực tế",
      "Tạo ra không gian làm việc phù hợp với bản thân"
    ],
    salary_ranges: {
      entry: "10-18 triệu VNĐ/tháng",
      mid: "18-35 triệu VNĐ/tháng",
      senior: "35-60+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực, đặc biệt trong các lĩnh vực giáo dục, tư vấn và công nghệ nhân văn."
  },

  INFP: {
    personalityType: "INFP",
    overview: "INFP là những người có giá trị mạnh mẽ và mong muốn thể hiện bản thân qua công việc. Họ thích làm việc độc lập và tạo ra những điều có ý nghĩa.",
    workEnvironment: {
      preferred: "Môi trường sáng tạo, linh hoạt, ít xung đột. Được tự do thể hiện giá trị và ý tưởng cá nhân.",
      avoid: "Môi trường quá cạnh tranh, xung đột cao, hoặc trái với giá trị cá nhân."
    },
    idealRoles: [
      {
        category: "Sáng tạo & Nghệ thuật",
        roles: ["Graphic Designer", "Writer", "Artist", "Photographer", "Video Editor"],
        description: "Thể hiện sự sáng tạo qua các tác phẩm nghệ thuật và thiết kế."
      },
      {
        category: "Tư vấn & Trị liệu",
        roles: ["Therapist", "Counselor", "Social Worker", "Life Coach"],
        description: "Hỗ trợ và chữa lành cho những người cần giúp đỡ."
      },
      {
        category: "Giáo dục & Phát triển",
        roles: ["Teacher", "Trainer", "Instructional Designer", "Educational Writer"],
        description: "Giáo dục và truyền cảm hứng cho người khác."
      },
      {
        category: "Phi lợi nhuận & Nhân đạo",
        roles: ["Program Coordinator", "Grant Writer", "Community Organizer", "Volunteer Manager"],
        description: "Làm việc vì các mục tiêu xã hội và nhân đạo."
      }
    ],
    keyStrengths: [
      "Sáng tạo và tư duy độc đáo",
      "Empathy và hiểu biết sâu sắc",
      "Giá trị mạnh mẽ và chính trực",
      "Khả năng truyền cảm hứng"
    ],
    developmentAreas: [
      "Kỹ năng assertiveness và đàm phán",
      "Quản lý thời gian và tổ chức",
      "Kỹ năng business và tài chính",
      "Networking và marketing bản thân"
    ],
    careerTips: [
      "Tìm kiếm công việc phù hợp với giá trị cá nhân",
      "Phát triển portfolio và thương hiệu cá nhân",
      "Cân bằng giữa passion và thu nhập",
      "Tìm kiếm mentor và community hỗ trợ"
    ],
    salary_ranges: {
      entry: "8-15 triệu VNĐ/tháng",
      mid: "15-28 triệu VNĐ/tháng",
      senior: "28-50+ triệu VNĐ/tháng"
    },
    industry_outlook: "Ổn định, với cơ hội tốt trong các lĩnh vực sáng tạo và dịch vụ nhân văn."
  },

  ENFJ: {
    personalityType: "ENFJ",
    overview: "ENFJ là những nhà lãnh đạo truyền cảm hứng, có khả năng động viên và phát triển người khác. Họ thích làm việc với con người và tạo ra môi trường tích cực.",
    workEnvironment: {
      preferred: "Môi trường hợp tác, tích cực, có cơ hội giúp đỡ và phát triển người khác. Được ghi nhận đóng góp.",
      avoid: "Môi trường quá cạnh tranh, cô lập, hoặc thiếu tương tác con người."
    },
    idealRoles: [
      {
        category: "Lãnh đạo & Quản lý",
        roles: ["Team Leader", "Department Manager", "HR Director", "Change Manager"],
        description: "Lãnh đạo và phát triển team, tạo ra văn hóa tổ chức tích cực."
      },
      {
        category: "Giáo dục & Đào tạo",
        roles: ["Teacher", "Training Manager", "Corporate Trainer", "Educational Director"],
        description: "Giảng dạy, đào tạo và phát triển năng lực cho người khác."
      },
      {
        category: "Tư vấn & Phát triển",
        roles: ["Organizational Consultant", "Executive Coach", "HR Business Partner", "Talent Development"],
        description: "Tư vấn và hỗ trợ phát triển tổ chức và cá nhân."
      },
      {
        category: "Marketing & Quan hệ",
        roles: ["Marketing Manager", "PR Manager", "Customer Success", "Community Manager"],
        description: "Xây dựng mối quan hệ và quản lý cộng đồng."
      }
    ],
    keyStrengths: [
      "Khả năng lãnh đạo và truyền cảm hứng",
      "Kỹ năng giao tiếp xuất sắc",
      "Hiểu biết sâu sắc về con người",
      "Tạo ra môi trường hợp tác tích cực"
    ],
    developmentAreas: [
      "Kỹ năng đưa ra quyết định khó khăn",
      "Quản lý stress và burnout",
      "Balance giữa giúp đỡ người khác và bản thân",
      "Kỹ năng phân tích và logic"
    ],
    careerTips: [
      "Tìm kiếm các vị trí có tương tác nhiều với con người",
      "Phát triển kỹ năng quản lý và lãnh đạo",
      "Học cách saying no và set boundaries",
      "Xây dựng network mạnh trong ngành"
    ],
    salary_ranges: {
      entry: "12-20 triệu VNĐ/tháng",
      mid: "20-40 triệu VNĐ/tháng",
      senior: "40-70+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực, đặc biệt trong các lĩnh vực giáo dục, HR và quản lý."
  },

  ENFP: {
    personalityType: "ENFP",
    overview: "ENFP là những người đầy nhiệt huyết và sáng tạo, thích khám phá cơ hội mới và kết nối với người khác. Họ mang lại năng lượng tích cực và ý tưởng sáng tạo cho mọi dự án.",
    workEnvironment: {
      preferred: "Môi trường năng động, sáng tạo, nhiều tương tác với đồng nghiệp. Được tự do thể hiện ý tưởng và có sự linh hoạt trong công việc.",
      avoid: "Công việc lặp đi lặp lại, môi trường cứng nhắc với nhiều quy tắc, ít tương tác xã hội hoặc quá nhiều chi tiết hành chính."
    },
    idealRoles: [
      {
        category: "Marketing & Truyền thông",
        roles: ["Chuyên viên Marketing", "Social Media Manager", "Content Creator", "Brand Manager", "Digital Marketing Specialist"],
        description: "Phát triển và thực hiện các chiến lược marketing sáng tạo, quản lý thương hiệu và tạo ra nội dung thu hút."
      },
      {
        category: "Tư vấn & Phát triển nhân sự",
        roles: ["Nhà tư vấn nghề nghiệp", "Life Coach", "HR Business Partner", "Training & Development Specialist", "Talent Acquisition"],
        description: "Hỗ trợ phát triển sự nghiệp, đào tạo nhân viên và xây dựng văn hóa doanh nghiệp tích cực."
      },
      {
        category: "Quan hệ công chúng & Truyền thông",
        roles: ["Chuyên viên PR", "Communications Manager", "Event Coordinator", "Media Relations Specialist"],
        description: "Xây dựng và duy trì hình ảnh tích cực của tổ chức, tổ chức sự kiện và quản lý mối quan hệ truyền thông."
      },
      {
        category: "Tâm lý & Chăm sóc sức khỏe",
        roles: ["Nhà tâm lý học", "Therapist", "Social Worker", "Counselor", "Mental Health Advocate"],
        description: "Cung cấp dịch vụ tư vấn tâm lý, hỗ trợ sức khỏe tinh thần và làm việc với cộng đồng."
      },
      {
        category: "Kinh doanh & Bán hàng",
        roles: ["Business Development Manager", "Sales Representative", "Account Manager", "Customer Success Manager"],
        description: "Phát triển kinh doanh mới, xây dựng mối quan hệ khách hàng và đảm bảo sự hài lòng của khách hàng."
      }
    ],
    keyStrengths: [
      "Năng lượng tích cực và nhiệt huyết cao trong công việc",
      "Khả năng sáng tạo và đổi mới liên tục",
      "Kỹ năng giao tiếp và networking xuất sắc",
      "Khả năng truyền cảm hứng và động viên người khác",
      "Thích nghi nhanh với những thay đổi và thử thách mới",
      "Tư duy mở và khả năng nhìn nhận đa chiều"
    ],
    developmentAreas: [
      "Kỹ năng quản lý thời gian và tổ chức công việc hiệu quả",
      "Khả năng tập trung lâu dài vào một nhiệm vụ cụ thể",
      "Kỹ năng phân tích dữ liệu và viết báo cáo chi tiết",
      "Kiên nhẫn với công việc có tính chất lặp lại và quy trình cố định",
      "Kỹ năng quản lý tài chính cá nhân và lập ngân sách",
      "Khả năng đưa ra quyết định khó khăn và dứt khoát"
    ],
    careerTips: [
      "Tìm kiếm công việc đa dạng, thú vị và có ý nghĩa xã hội",
      "Phát triển kỹ năng quản lý dự án để hoàn thành công việc đúng hạn",
      "Xây dựng mạng lưới quan hệ rộng và đa dạng trong nhiều lĩnh vực",
      "Học cách cân bằng giữa nhiều dự án và khả năng tập trung sâu",
      "Tìm kiếm mentor và coach để hướng dẫn phát triển sự nghiệp",
      "Tạo ra routine và hệ thống làm việc phù hợp với phong cách cá nhân",
      "Đừng ngại thử nghiệm các vai trò và ngành nghề khác nhau"
    ],
    salary_ranges: {
      entry: "10-18 triệu VNĐ/tháng",
      mid: "18-35 triệu VNĐ/tháng", 
      senior: "35-65+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất tích cực! Trong thời đại số hóa hiện nay, nhu cầu cao cho các vị trí marketing, truyền thông, tư vấn và các ngành sáng tạo. Đặc biệt là các vai trò yêu cầu kỹ năng giao tiếp, sáng tạo và khả năng thích nghi với công nghệ mới."
  },

  ISFJ: {
    personalityType: "ISFJ",
    overview: "ISFJ - 'Người bảo vệ' là những người tận tâm, chu đáo và có trách nhiệm cao. Họ thích giúp đỡ người khác và làm việc trong môi trường ổn định, có cấu trúc rõ ràng.",
    workEnvironment: {
      preferred: "Môi trường hòa hợp, ổn định, có cấu trúc rõ ràng. Được ghi nhận đóng góp và có cơ hội giúp đỡ người khác.",
      avoid: "Môi trường căng thẳng, cạnh tranh gay gắt, thay đổi liên tục hoặc thiếu quy trình rõ ràng."
    },
    idealRoles: [
      {
        category: "Y tế & Chăm sóc sức khỏe",
        roles: ["Y tá", "Dược sĩ", "Chuyên viên vật lý trị liệu", "Nhân viên chăm sóc bệnh nhân", "Medical Assistant"],
        description: "Chăm sóc và hỗ trợ bệnh nhân, cung cấp dịch vụ y tế với sự tận tâm và chu đáo."
      },
      {
        category: "Giáo dục & Đào tạo",
        roles: ["Giáo viên tiểu học", "Nhà giáo dục đặc biệt", "Thủ thư", "Training Coordinator", "Academic Advisor"],
        description: "Giảng dạy và hỗ trợ học sinh, tạo ra môi trường học tập tích cực và an toàn."
      },
      {
        category: "Hành chính & Hỗ trợ",
        roles: ["HR Specialist", "Office Manager", "Executive Assistant", "Customer Service Manager", "Administrative Coordinator"],
        description: "Quản lý và tổ chức công việc hành chính, hỗ trợ đồng nghiệp và khách hàng hiệu quả."
      },
      {
        category: "Tài chính & Kế toán",
        roles: ["Kế toán", "Auditor", "Tax Specialist", "Financial Advisor", "Banking Officer"],
        description: "Quản lý tài chính với độ chính xác cao và tuân thủ nghiêm ngặt các quy định."
      }
    ],
    keyStrengths: [
      "Tính trách nhiệm cao và đáng tin cậy",
      "Chú ý đến chi tiết và độ chính xác",
      "Kỹ năng lắng nghe và empathy tốt",
      "Khả năng tổ chức và quản lý thời gian hiệu quả",
      "Sự kiên nhẫn và bền bỉ trong công việc",
      "Khả năng làm việc nhóm hòa hợp"
    ],
    developmentAreas: [
      "Tự tin thể hiện ý kiến và đóng góp",
      "Kỹ năng negotiation và conflict resolution",
      "Khả năng thích nghi với thay đổi",
      "Leadership và quản lý đội nhóm",
      "Tư duy chiến lược và nhìn xa trông rộng",
      "Kỹ năng public speaking"
    ],
    careerTips: [
      "Tìm kiếm các vị trí có ý nghĩa xã hội và giúp đỡ người khác",
      "Phát triển kỹ năng lãnh đạo từ từ trong vai trò hỗ trợ",
      "Xây dựng mạng lưới quan hệ trong lĩnh vực chuyên môn",
      "Học cách saying no và thiết lập boundaries",
      "Tìm kiếm feedback để cải thiện hiệu suất",
      "Cân bằng giữa giúp đỡ người khác và phát triển bản thân",
      "Tham gia các khóa đào tạo soft skills"
    ],
    salary_ranges: {
      entry: "8-15 triệu VNĐ/tháng",
      mid: "15-30 triệu VNĐ/tháng",
      senior: "30-55+ triệu VNĐ/tháng"
    },
    industry_outlook: "Ổn định và tích cực, đặc biệt trong các lĩnh vực y tế, giáo dục và dịch vụ khách hàng với nhu cầu cao về nhân lực chất lượng."
  },

  ISFP: {
    personalityType: "ISFP",
    overview: "ISFP - 'Người nghệ sĩ' là những cá nhân sáng tạo, nhạy cảm và có giá trị cá nhân mạnh mẽ. Họ thích làm việc với nghệ thuật, thiên nhiên và giúp đỡ người khác theo cách riêng.",
    workEnvironment: {
      preferred: "Môi trường linh hoạt, sáng tạo, ít stress và áp lực. Được tự do thể hiện cá tính và có thời gian làm việc riêng.",
      avoid: "Môi trường cứng nhắc, quá nhiều deadline gấp, cạnh tranh gay gắt hoặc xung đột thường xuyên."
    },
    idealRoles: [
      {
        category: "Nghệ thuật & Sáng tạo",
        roles: ["Graphic Designer", "Photographer", "Artist", "Interior Designer", "Fashion Designer"],
        description: "Tạo ra các tác phẩm nghệ thuật, thiết kế và sáng tạo với phong cách cá nhân độc đáo."
      },
      {
        category: "Y tế & Chăm sóc",
        roles: ["Physical Therapist", "Occupational Therapist", "Veterinarian", "Massage Therapist", "Mental Health Counselor"],
        description: "Chăm sóc và hỗ trợ sức khỏe con người và động vật với sự tận tâm và nhạy cảm."
      },
      {
        category: "Giáo dục & Phát triển",
        roles: ["Giáo viên mầm non", "Art Teacher", "Music Instructor", "Special Education Teacher", "Child Counselor"],
        description: "Giảng dạy và hướng dẫn trẻ em, học sinh với phương pháp sáng tạo và cá nhân hóa."
      },
      {
        category: "Tự nhiên & Môi trường",
        roles: ["Park Ranger", "Environmental Scientist", "Marine Biologist", "Landscape Designer", "Conservation Worker"],
        description: "Làm việc với thiên nhiên và bảo vệ môi trường, kết hợp passion với trách nhiệm xã hội."
      }
    ],
    keyStrengths: [
      "Khả năng sáng tạo và thẩm mỹ cao",
      "Empathy và hiểu biết sâu sắc về cảm xúc",
      "Linh hoạt và thích nghi tốt",
      "Làm việc độc lập hiệu quả",
      "Tinh thần phục vụ cộng đồng",
      "Khả năng quan sát và chú ý đến chi tiết"
    ],
    developmentAreas: [
      "Kỹ năng quản lý thời gian và deadline",
      "Tự tin trình bày ý tưởng trước đám đông",
      "Kỹ năng negotiation và business",
      "Leadership và quản lý đội nhóm",
      "Kỹ năng marketing bản thân",
      "Khả năng đối mặt với conflict"
    ],
    careerTips: [
      "Tìm kiếm công việc phù hợp với giá trị cá nhân",
      "Phát triển portfolio và thương hiệu cá nhân",
      "Học cách quản lý tài chính và pricing",
      "Xây dựng network trong cộng đồng sáng tạo",
      "Cân bằng giữa passion và thu nhập ổn định",
      "Tìm kiếm mentor trong lĩnh vực quan tâm",
      "Đừng ngại thử nghiệm các hướng nghề nghiệp khác nhau"
    ],
    salary_ranges: {
      entry: "7-12 triệu VNĐ/tháng",
      mid: "12-25 triệu VNĐ/tháng",
      senior: "25-45+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực trong lĩnh vực sáng tạo, đặc biệt với sự phát triển của digital marketing, media và nhu cầu cao về thiết kế trong thời đại số."
  },

  ISTJ: {
    personalityType: "ISTJ",
    overview: "ISTJ - 'Người hậu cần' là những cá nhân đáng tin cậy, có tổ chức và tuân thủ quy tắc. Họ thích làm việc trong môi trường ổn định với quy trình rõ ràng và có thể dự đoán được.",
    workEnvironment: {
      preferred: "Môi trường có cấu trúc, ổn định, quy trình rõ ràng. Có thời gian để hoàn thành công việc một cách kỹ lưỡng.",
      avoid: "Môi trường thay đổi liên tục, áp lực cao, thiếu quy trình hoặc quá nhiều interruption."
    },
    idealRoles: [
      {
        category: "Tài chính & Kế toán",
        roles: ["Accountant", "Auditor", "Tax Specialist", "Financial Analyst", "Budget Analyst"],
        description: "Quản lý tài chính với độ chính xác cao, tuân thủ quy định và phân tích dữ liệu tài chính."
      },
      {
        category: "Pháp lý & Tuân thủ",
        roles: ["Lawyer", "Legal Assistant", "Compliance Officer", "Paralegal", "Court Reporter"],
        description: "Làm việc với luật pháp, đảm bảo tuân thủ quy định và xử lý các vấn đề pháp lý."
      },
      {
        category: "Quản lý & Vận hành",
        roles: ["Operations Manager", "Project Manager", "Office Manager", "Logistics Coordinator", "Quality Assurance"],
        description: "Tổ chức và quản lý các quy trình, đảm bảo hiệu quả vận hành và chất lượng."
      },
      {
        category: "Y tế & Khoa học",
        roles: ["Medical Technologist", "Pharmacist", "Lab Technician", "Health Information Manager", "Medical Records"],
        description: "Làm việc trong lĩnh vực y tế với yêu cầu chính xác cao và tuân thủ nghiêm ngặt quy trình."
      }
    ],
    keyStrengths: [
      "Đáng tin cậy và có trách nhiệm cao",
      "Tổ chức và quản lý thời gian xuất sắc",
      "Chú ý đến chi tiết và độ chính xác",
      "Kiên nhẫn và bền bỉ",
      "Tuân thủ quy trình và deadline",
      "Khả năng làm việc độc lập hiệu quả"
    ],
    developmentAreas: [
      "Khả năng thích nghi với thay đổi",
      "Kỹ năng giao tiếp và thuyết trình",
      "Tư duy sáng tạo và innovation",
      "Leadership và quản lý đội nhóm",
      "Networking và xây dựng mối quan hệ",
      "Tư duy chiến lược dài hạn"
    ],
    careerTips: [
      "Tìm kiếm vị trí trong các tổ chức ổn định, có uy tín",
      "Phát triển chuyên môn sâu trong lĩnh vực cụ thể",
      "Học cách thích nghi với công nghệ mới",
      "Xây dựng reputation về độ tin cậy và chất lượng",
      "Tham gia các khóa đào tạo leadership",
      "Tìm kiếm cơ hội mentoring junior",
      "Cân bằng giữa stability và growth opportunities"
    ],
    salary_ranges: {
      entry: "12-18 triệu VNĐ/tháng",
      mid: "18-35 triệu VNĐ/tháng",
      senior: "35-60+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất ổn định và tích cực, đặc biệt trong các lĩnh vực tài chính, pháp lý, y tế và quản lý với nhu cầu cao về nhân lực đáng tin cậy."
  },

  ISTP: {
    personalityType: "ISTP",
    overview: "ISTP - 'Người thợ khéo' là những cá nhân thực tế, giải quyết vấn đề tốt và thích làm việc với tay. Họ thích khám phá cách thức hoạt động và sửa chữa mọi thứ.",
    workEnvironment: {
      preferred: "Môi trường linh hoạt, hands-on, ít micromanagement. Được tự do thử nghiệm và giải quyết vấn đề theo cách riêng.",
      avoid: "Môi trường quá nhiều meeting, paperwork, rules cứng nhắc hoặc pressure về social interaction."
    },
    idealRoles: [
      {
        category: "Kỹ thuật & Công nghệ",
        roles: ["Mechanical Engineer", "Software Developer", "Network Administrator", "IT Support", "System Administrator"],
        description: "Thiết kế, phát triển và bảo trì các hệ thống kỹ thuật và công nghệ."
      },
      {
        category: "Sửa chữa & Bảo trì",
        roles: ["Auto Mechanic", "HVAC Technician", "Electrician", "Plumber", "Equipment Repair"],
        description: "Chẩn đoán và sửa chữa các thiết bị, máy móc với kỹ năng thực hành cao."
      },
      {
        category: "An ninh & Ứng cứu",
        roles: ["Police Officer", "Firefighter", "Paramedic", "Security Specialist", "Emergency Responder"],
        description: "Ứng phó với các tình huống khẩn cấp và đảm bảo an ninh an toàn."
      },
      {
        category: "Ngoài trời & Thể thao",
        roles: ["Park Ranger", "Construction Supervisor", "Sports Coach", "Pilot", "Marine Engineer"],
        description: "Làm việc trong môi trường ngoài trời và các hoạt động thể chất."
      }
    ],
    keyStrengths: [
      "Kỹ năng giải quyết vấn đề thực tế xuất sắc",
      "Khả năng làm việc với tay và tools",
      "Thích nghi nhanh và linh hoạt",
      "Làm việc độc lập hiệu quả",
      "Calm under pressure",
      "Tư duy logic và phân tích"
    ],
    developmentAreas: [
      "Kỹ năng giao tiếp và teamwork",
      "Planning và time management dài hạn",
      "Leadership và quản lý người khác",
      "Business và financial skills",
      "Presentation và public speaking",
      "Customer service và relationship building"
    ],
    careerTips: [
      "Tìm kiếm công việc cho phép hands-on và problem solving",
      "Phát triển technical expertise trong lĩnh vực quan tâm",
      "Học cách communicate technical ideas hiệu quả",
      "Tham gia các certification và training programs",
      "Xây dựng portfolio về các dự án đã thực hiện",
      "Network với các professionals trong field",
      "Cân bằng giữa independent work và team collaboration"
    ],
    salary_ranges: {
      entry: "10-16 triệu VNĐ/tháng",
      mid: "16-32 triệu VNĐ/tháng",
      senior: "32-55+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực, đặc biệt trong lĩnh vực công nghệ, engineering và trades với nhu cầu cao về skilled technicians."
  },

  ESFJ: {
    personalityType: "ESFJ",
    overview: "ESFJ - 'Người quan tâm' là những cá nhân ấm áp, có trách nhiệm và thích giúp đỡ người khác. Họ xuất sắc trong việc tạo ra môi trường hòa hợp và hỗ trợ mọi người xung quanh.",
    workEnvironment: {
      preferred: "Môi trường thân thiện, hợp tác, có interaction với người khác. Được ghi nhận contribution và có cơ hội giúp đỡ team.",
      avoid: "Môi trường cạnh tranh gay gắt, cô lập, conflict thường xuyên hoặc thiếu appreciation."
    },
    idealRoles: [
      {
        category: "Giáo dục & Đào tạo",
        roles: ["Teacher", "School Counselor", "Training Manager", "Academic Advisor", "Educational Coordinator"],
        description: "Giảng dạy, hướng dẫn và hỗ trợ học sinh với sự tận tâm và quan tâm cá nhân."
      },
      {
        category: "Y tế & Chăm sóc",
        roles: ["Nurse", "Social Worker", "Physical Therapist", "Healthcare Administrator", "Patient Coordinator"],
        description: "Chăm sóc sức khỏe và phúc lợi của bệnh nhân với sự empathy và professional care."
      },
      {
        category: "Nhân sự & Quan hệ",
        roles: ["HR Manager", "Recruiter", "Employee Relations", "Customer Service Manager", "Community Outreach"],
        description: "Quản lý nhân sự, xây dựng mối quan hệ và tạo ra môi trường làm việc tích cực."
      },
      {
        category: "Bán hàng & Marketing",
        roles: ["Sales Representative", "Account Manager", "Marketing Coordinator", "Event Planner", "Public Relations"],
        description: "Xây dựng mối quan hệ khách hàng và thực hiện các hoạt động marketing, events."
      }
    ],
    keyStrengths: [
      "Kỹ năng giao tiếp và interpersonal xuất sắc",
      "Empathy và quan tâm đến người khác",
      "Tổ chức và quản lý events hiệu quả",
      "Khả năng motivate và support team members",
      "Responsible và dependable",
      "Tạo ra môi trường làm việc tích cực"
    ],
    developmentAreas: [
      "Assertiveness và conflict resolution",
      "Tư duy chiến lược và big picture thinking",
      "Technical skills và data analysis",
      "Self-care và setting boundaries",
      "Critical thinking và objective decision making",
      "Innovation và creative problem solving"
    ],
    careerTips: [
      "Tìm kiếm vai trò có tương tác nhiều với người khác",
      "Phát triển leadership skills và emotional intelligence",
      "Học cách balance giữa helping others và career goals",
      "Xây dựng professional network rộng",
      "Tham gia các training về conflict management",
      "Seek feedback để improve performance",
      "Consider roles trong non-profit hoặc service industries"
    ],
    salary_ranges: {
      entry: "10-16 triệu VNĐ/tháng",
      mid: "16-30 triệu VNĐ/tháng",
      senior: "30-50+ triệu VNĐ/tháng"
    },
    industry_outlook: "Ổn định và tích cực, đặc biệt trong các lĩnh vực giáo dục, y tế, HR và service industries với focus trên human interaction."
  },

  ESFP: {
    personalityType: "ESFP",
    overview: "ESFP - 'Người biểu diễn' là những cá nhân năng động, nhiệt tình và thích tương tác với người khác. Họ mang lại năng lượng tích cực và thích làm việc trong môi trường vui vẻ, sáng tạo.",
    workEnvironment: {
      preferred: "Môi trường năng động, vui vẻ, nhiều tương tác xã hội. Được freedom để express creativity và work với people.",
      avoid: "Môi trường quá formal, nhiều paperwork, routine work hoặc ít interaction với người khác."
    },
    idealRoles: [
      {
        category: "Giải trí & Truyền thông",
        roles: ["Event Coordinator", "TV/Radio Host", "Actor/Performer", "Social Media Manager", "Entertainment Industry"],
        description: "Tạo ra và thực hiện các chương trình giải trí, events và content truyền thông."
      },
      {
        category: "Bán hàng & Marketing",
        roles: ["Sales Representative", "Retail Manager", "Brand Ambassador", "Marketing Specialist", "Customer Relations"],
        description: "Tương tác với khách hàng, quảng bá sản phẩm và xây dựng relationships."
      },
      {
        category: "Giáo dục & Phát triển",
        roles: ["Elementary Teacher", "Fitness Instructor", "Corporate Trainer", "Camp Counselor", "Youth Coordinator"],
        description: "Giảng dạy và hướng dẫn với approach năng động, interactive và engaging."
      },
      {
        category: "Dịch vụ & Chăm sóc",
        roles: ["Flight Attendant", "Tour Guide", "Restaurant Manager", "Beauty Consultant", "Recreation Director"],
        description: "Cung cấp dịch vụ khách hàng với sự nhiệt tình và attention to experience."
      }
    ],
    keyStrengths: [
      "Năng lượng tích cực và enthusiasm",
      "Kỹ năng communication và presentation",
      "Khả năng inspire và motivate người khác",
      "Adaptability và flexibility",
      "Strong people skills và emotional intelligence",
      "Creativity và innovation trong approach"
    ],
    developmentAreas: [
      "Time management và organization skills",
      "Long-term planning và strategic thinking",
      "Conflict resolution và difficult conversations",
      "Technical skills và data analysis",
      "Follow-through và attention to detail",
      "Financial planning và money management"
    ],
    careerTips: [
      "Tìm kiếm roles cho phép interaction với diverse groups",
      "Develop professional skills để support natural talents",
      "Build network trong industries quan tâm",
      "Learn to balance spontaneity với professional requirements",
      "Seek mentorship để develop career planning skills",
      "Consider entrepreneurship hoặc freelancing opportunities",
      "Focus trên roles có immediate impact và visible results"
    ],
    salary_ranges: {
      entry: "8-14 triệu VNĐ/tháng",
      mid: "14-25 triệu VNĐ/tháng",
      senior: "25-45+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực trong lĩnh vực service, entertainment, và experience economy với growing demand for customer experience professionals."
  },

  ESTJ: {
    personalityType: "ESTJ",
    overview: "ESTJ - 'Người điều hành' là những nhà lãnh đạo tự nhiên, có tổ chức và quyết đoán. Họ thích quản lý và điều hành, đảm bảo mọi việc được thực hiện hiệu quả và đúng deadline.",
    workEnvironment: {
      preferred: "Môi trường có cấu trúc, hierarchy rõ ràng, mục tiêu cụ thể. Có authority và responsibility để đưa ra decisions.",
      avoid: "Môi trường không có structure, ambiguous roles, quá nhiều creativity requirements hoặc lack of clear direction."
    },
    idealRoles: [
      {
        category: "Quản lý & Lãnh đạo",
        roles: ["General Manager", "Operations Director", "Department Head", "Team Leader", "Executive Manager"],
        description: "Lãnh đạo teams, quản lý operations và đảm bảo organizational goals được achieved."
      },
      {
        category: "Tài chính & Kinh doanh",
        roles: ["Finance Manager", "Business Analyst", "Bank Manager", "Investment Advisor", "CFO"],
        description: "Quản lý tài chính, phân tích business và đưa ra financial decisions."
      },
      {
        category: "Bán hàng & Phát triển",
        roles: ["Sales Manager", "Business Development Director", "Account Executive", "Sales Director", "Regional Manager"],
        description: "Lead sales teams, develop business strategies và manage key accounts."
      },
      {
        category: "Pháp lý & Tuân thủ",
        roles: ["Corporate Lawyer", "Compliance Manager", "Legal Counsel", "Contract Manager", "Risk Manager"],
        description: "Ensure legal compliance, manage contracts và handle legal matters."
      }
    ],
    keyStrengths: [
      "Natural leadership và management abilities",
      "Excellent organizational và planning skills",
      "Strong decision-making và problem-solving",
      "Results-oriented và goal-focused",
      "Effective communication và delegation",
      "Reliable và consistent performance"
    ],
    developmentAreas: [
      "Flexibility và adapting to change",
      "Emotional intelligence và empathy",
      "Creative thinking và innovation",
      "Patience với different working styles",
      "Active listening và collaborative approach",
      "Work-life balance và stress management"
    ],
    careerTips: [
      "Seek leadership roles và management opportunities",
      "Develop emotional intelligence để complement natural skills",
      "Build diverse professional network",
      "Stay current với industry trends và best practices",
      "Learn to delegate effectively và trust team members",
      "Invest in continuous learning và professional development",
      "Balance directive style với collaborative leadership"
    ],
    salary_ranges: {
      entry: "15-22 triệu VNĐ/tháng",
      mid: "22-45 triệu VNĐ/tháng",
      senior: "45-80+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất tích cực với high demand cho experienced managers và leaders across all industries, đặc biệt trong corporate environments."
  },

  ESTP: {
    personalityType: "ESTP",
    overview: "ESTP - 'Người khuyến khích' là những cá nhân năng động, thực tế và thích action. Họ excel trong situations yêu cầu quick thinking, adaptability và direct interaction với people.",
    workEnvironment: {
      preferred: "Môi trường fast-paced, dynamic, nhiều variety. Có freedom để move around và interact với different people daily.",
      avoid: "Môi trường quá structured, desk-bound, routine work hoặc requires long-term detailed planning."
    },
    idealRoles: [
      {
        category: "Bán hàng & Phát triển kinh doanh",
        roles: ["Sales Executive", "Business Development Representative", "Account Manager", "Retail Manager", "Territory Sales"],
        description: "Build relationships, close deals và develop new business opportunities through direct interaction."
      },
      {
        category: "Dịch vụ khẩn cấp & An ninh",
        roles: ["Police Officer", "Firefighter", "EMT/Paramedic", "Security Manager", "Crisis Response"],
        description: "Respond to emergencies, handle crisis situations và ensure public safety."
      },
      {
        category: "Giải trí & Thể thao",
        roles: ["Sports Coach", "Personal Trainer", "Event Coordinator", "Recreation Director", "Tour Guide"],
        description: "Lead activities, coordinate events và work với people trong fun, active environments."
      },
      {
        category: "Doanh nghiệp & Khởi nghiệp",
        roles: ["Entrepreneur", "Franchise Owner", "Small Business Owner", "Restaurant Manager", "Real Estate Agent"],
        description: "Start và manage businesses, work directly với customers và make quick business decisions."
      }
    ],
    keyStrengths: [
      "Excellent people skills và ability to connect quickly",
      "Adaptability và flexibility trong changing situations",
      "Strong persuasion và negotiation abilities",
      "Practical problem-solving với immediate solutions",
      "High energy và motivation",
      "Crisis management và ability to stay calm under pressure"
    ],
    developmentAreas: [
      "Long-term planning và strategic thinking",
      "Attention to detail và thoroughness",
      "Patience với processes và procedures",
      "Financial planning và money management",
      "Following through trên commitments",
      "Developing depth của expertise trong specific areas"
    ],
    careerTips: [
      "Choose careers với variety và people interaction",
      "Develop expertise trong specific sales hoặc service areas",
      "Build strong professional network for referrals",
      "Learn basic financial management for entrepreneurship",
      "Seek roles với quick feedback và visible results",
      "Consider commission-based roles để maximize earning potential",
      "Balance action-orientation với strategic planning skills"
    ],
    salary_ranges: {
      entry: "12-18 triệu VNĐ/tháng",
      mid: "18-35 triệu VNĐ/tháng",
      senior: "35-65+ triệu VNĐ/tháng"
    },
    industry_outlook: "Tích cực với growing opportunities trong sales, service industries, và entrepreneurship, đặc biệt trong experience economy."
  },

  INTJ: {
    personalityType: "INTJ",
    overview: "INTJ - 'Kiến trúc sư' là những chiến lược gia bẩm sinh, có tầm nhìn xa và khả năng biến ý tưởng thành hiện thực. Họ làm việc tốt nhất khi được tự chủ và tập trung vào các dự án phức tạp, dài hạn.",
    workEnvironment: {
      preferred: "Môi trường yên tĩnh, độc lập, ít gián đoạn. Có quyền tự chủ cao trong ra quyết định và được làm việc với các vấn đề phức tạp, thử thách trí tuệ.",
      avoid: "Môi trường ồn ào, quá nhiều cuộc họp không cần thiết, vi quản lý chi tiết hoặc công việc lặp đi lặp lại thiếu tính sáng tạo."
    },
    idealRoles: [
      {
        category: "Công nghệ & Phát triển hệ thống",
        roles: ["Software Architect", "Senior Developer", "System Engineer", "CTO", "Technical Lead"],
        description: "Thiết kế và phát triển các hệ thống phức tạp, dẫn dắt đội ngũ kỹ thuật và đưa ra các quyết định công nghệ quan trọng."
      },
      {
        category: "Tài chính & Đầu tư",
        roles: ["Investment Analyst", "Quant Developer", "Financial Planner", "Risk Manager", "Portfolio Manager"],
        description: "Phân tích thị trường tài chính, phát triển mô hình đầu tư và quản lý rủi ro với phương pháp tiếp cận có hệ thống."
      },
      {
        category: "Nghiên cứu & Khoa học",
        roles: ["Research Scientist", "Data Scientist", "Professor", "R&D Manager", "Strategy Consultant"],
        description: "Thực hiện nghiên cứu sâu, phát triển lý thuyết mới và ứng dụng kiến thức khoa học vào thực tế."
      },
      {
        category: "Quản lý & Chiến lược",
        roles: ["CEO", "Operations Director", "Strategy Manager", "Business Analyst", "Management Consultant"],
        description: "Xây dựng chiến lược dài hạn, tối ưu hóa quy trình và dẫn dắt tổ chức đạt được mục tiêu."
      }
    ],
    keyStrengths: [
      "Tư duy chiến lược và nhìn xa trông rộng",
      "Khả năng phân tích và giải quyết vấn đề phức tạp một cách có hệ thống",
      "Làm việc độc lập hiệu quả và tự động viên bản thân",
      "Có tầm nhìn dài hạn và khả năng lập kế hoạch chi tiết",
      "Quyết đoán và kiên định với các quyết định đã đưa ra",
      "Khả năng tổng hợp thông tin từ nhiều nguồn khác nhau"
    ],
    developmentAreas: [
      "Kỹ năng giao tiếp và thuyết trình để truyền đạt ý tưởng hiệu quả hơn",
      "Kỹ năng lãnh đạo và quản lý đội nhóm một cách nhân văn",
      "Kiên nhẫn với những người làm việc chậm hơn hoặc cần nhiều hướng dẫn",
      "Kỹ năng networking và xây dựng mối quan hệ trong công việc",
      "Khả năng thích nghi với những thay đổi đột ngột",
      "Cân bằng giữa tính hoàn hảo và thực tế"
    ],
    careerTips: [
      "Tìm kiếm các vị trí cho phép làm việc độc lập và có quyền tự chủ cao",
      "Phát triển kỹ năng leadership để dẫn dắt team hiệu quả",
      "Tham gia các dự án có tầm ảnh hưởng lớn và tính chất dài hạn",
      "Đầu tư thời gian để xây dựng network chuyên nghiệp",
      "Liên tục học hỏi và cập nhật kiến thức trong lĩnh vực chuyên môn",
      "Tìm mentor hoặc coach để phát triển soft skills",
      "Cân bằng giữa công việc và cuộc sống cá nhân"
    ],
    salary_ranges: {
      entry: "15-25 triệu VNĐ/tháng",
      mid: "25-50 triệu VNĐ/tháng", 
      senior: "50-100+ triệu VNĐ/tháng"
    },
    industry_outlook: "Rất tích cực! INTJ đặc biệt thành công trong thời đại công nghệ số, AI và big data. Nhu cầu cao cho các vị trí chiến lược, quản lý cấp cao và chuyên gia trong các lĩnh vực công nghệ, tài chính, tư vấn."
  }
};

export const getCareerGuidance = (personalityType: string): CareerGuidanceDetail | null => {
  return careerGuidanceData[personalityType.toUpperCase()] || null;
}; 