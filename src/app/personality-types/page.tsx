"use client";
import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const mbtiTypes = [
  {
    type: "INTJ",
    name: "Kiến trúc sư (Architect)",
    description:
      "INTJ là những người có tầm nhìn chiến lược, độc lập, quyết đoán và rất logic. Họ thích lập kế hoạch dài hạn và luôn tìm kiếm sự cải tiến.",
  },
  {
    type: "INTP",
    name: "Nhà tư duy (Logician)",
    description:
      "INTP là những người phân tích, tò mò, sáng tạo và thích khám phá các ý tưởng mới. Họ thường suy nghĩ sâu sắc và độc lập.",
  },
  {
    type: "ENTJ",
    name: "Nhà lãnh đạo (Commander)",
    description:
      "ENTJ là những người lãnh đạo bẩm sinh, quyết đoán, có khả năng tổ chức và định hướng mục tiêu rõ ràng.",
  },
  {
    type: "ENTP",
    name: "Người tranh luận (Debater)",
    description:
      "ENTP là những người sáng tạo, thích tranh luận, linh hoạt và luôn tìm kiếm giải pháp mới cho các vấn đề.",
  },
  {
    type: "INFJ",
    name: "Người che chở (Advocate)",
    description:
      "INFJ là những người lý tưởng, sâu sắc, quan tâm đến người khác và luôn hướng tới mục tiêu ý nghĩa.",
  },
  {
    type: "INFP",
    name: "Người hòa giải (Mediator)",
    description:
      "INFP là những người giàu cảm xúc, sáng tạo, trung thành với giá trị cá nhân và luôn mong muốn giúp đỡ người khác.",
  },
  {
    type: "ENFJ",
    name: "Người cho đi (Protagonist)",
    description:
      "ENFJ là những người truyền cảm hứng, giàu lòng trắc ẩn, có khả năng lãnh đạo và quan tâm đến cộng đồng.",
  },
  {
    type: "ENFP",
    name: "Người truyền cảm hứng (Campaigner)",
    description:
      "ENFP là những người nhiệt huyết, sáng tạo, giàu trí tưởng tượng và luôn tìm kiếm ý nghĩa trong cuộc sống.",
  },
  {
    type: "ISTJ",
    name: "Người trách nhiệm (Logistician)",
    description:
      "ISTJ là những người thực tế, đáng tin cậy, có tổ chức và luôn tuân thủ nguyên tắc.",
  },
  {
    type: "ISFJ",
    name: "Người bảo vệ (Defender)",
    description:
      "ISFJ là những người tận tâm, chu đáo, trung thành và luôn quan tâm đến người khác.",
  },
  {
    type: "ESTJ",
    name: "Người điều hành (Executive)",
    description:
      "ESTJ là những người thực tế, quyết đoán, có khả năng tổ chức và lãnh đạo tốt.",
  },
  {
    type: "ESFJ",
    name: "Người quan tâm (Consul)",
    description:
      "ESFJ là những người hòa đồng, chu đáo, thích giúp đỡ và quan tâm đến cộng đồng.",
  },
  {
    type: "ISTP",
    name: "Người thợ lành nghề (Virtuoso)",
    description:
      "ISTP là những người thực tế, linh hoạt, thích khám phá và giải quyết vấn đề bằng hành động.",
  },
  {
    type: "ISFP",
    name: "Người nghệ sĩ (Adventurer)",
    description:
      "ISFP là những người sáng tạo, nhạy cảm, sống theo cảm xúc và yêu thích tự do.",
  },
  {
    type: "ESTP",
    name: "Người năng động (Entrepreneur)",
    description:
      "ESTP là những người năng động, thực tế, thích thử thách và giải quyết vấn đề nhanh chóng.",
  },
  {
    type: "ESFP",
    name: "Người trình diễn (Entertainer)",
    description:
      "ESFP là những người vui vẻ, hòa đồng, thích tận hưởng cuộc sống và mang lại niềm vui cho người khác.",
  },
];

const PersonalityTypesPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Danh sách 16 loại tính cách MBTI
      </Typography>
      <Box>
        {mbtiTypes.map((item) => (
          <Accordion key={item.type}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{item.type} - {item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default PersonalityTypesPage; 