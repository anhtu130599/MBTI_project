'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        Giới thiệu về MBTI
      </Typography>

      <Grid container spacing={4}>
        {/* Lịch sử MBTI */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h4" component="h2" gutterBottom color="primary">
              Lịch sử phát triển của MBTI
            </Typography>
            <Typography paragraph>
              MBTI (Myers-Briggs Type Indicator) được phát triển bởi Katharine Cook Briggs và con gái của bà, Isabel Briggs Myers, vào những năm 1940. 
              Công cụ này dựa trên lý thuyết về các loại tâm lý của Carl Jung, một nhà tâm lý học nổi tiếng người Thụy Sĩ.
            </Typography>
            <Typography paragraph>
              Ban đầu, Briggs và Myers bắt đầu nghiên cứu về tính cách con người trong Thế chiến thứ hai, với mục đích giúp phụ nữ tìm được công việc 
              phù hợp trong thời kỳ chiến tranh. Họ đã phát triển một bảng câu hỏi để xác định các loại tính cách khác nhau, dựa trên công trình nghiên 
              cứu của Jung về các chức năng tâm lý.
            </Typography>
            <Typography paragraph>
              Ngày nay, MBTI đã trở thành một trong những công cụ đánh giá tính cách được sử dụng rộng rãi nhất trên thế giới, được áp dụng trong nhiều 
              lĩnh vực như giáo dục, tư vấn nghề nghiệp, và phát triển tổ chức.
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Nguyên lý hoạt động */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h4" component="h2" gutterBottom color="primary">
              Nguyên lý hoạt động của trắc nghiệm MBTI
            </Typography>
            <Typography paragraph>
              MBTI dựa trên bốn cặp đối lập về tính cách, tạo thành 16 loại tính cách khác nhau:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" paragraph>
                <strong>Hướng ngoại (E) - Hướng nội (I):</strong> Cách con người tương tác với thế giới bên ngoài và nơi họ lấy năng lượng.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Cảm nhận (S) - Trực giác (N):</strong> Cách con người thu thập và xử lý thông tin.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Lý trí (T) - Cảm xúc (F):</strong> Cách con người đưa ra quyết định.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Nguyên tắc (J) - Linh hoạt (P):</strong> Cách con người tổ chức cuộc sống và công việc.
              </Typography>
            </Box>
            <Typography paragraph>
              Mỗi người sẽ có xu hướng thiên về một trong hai đặc điểm của mỗi cặp, tạo nên một loại tính cách duy nhất với bốn chữ cái (ví dụ: INTJ, ENFP).
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Mối quan hệ với nghề nghiệp */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h4" component="h2" gutterBottom color="primary">
              MBTI và Định hướng nghề nghiệp
            </Typography>
            <Typography paragraph>
              MBTI là một công cụ hữu ích trong việc định hướng nghề nghiệp vì nó giúp:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" paragraph>
                <strong>Hiểu rõ bản thân:</strong> Giúp người dùng nhận thức được điểm mạnh, điểm yếu và xu hướng tự nhiên của mình.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Phù hợp với môi trường làm việc:</strong> Mỗi loại tính cách sẽ phù hợp với những môi trường làm việc khác nhau. Ví dụ, người hướng ngoại 
                có thể phù hợp với các công việc giao tiếp nhiều, trong khi người hướng nội có thể phát triển tốt trong môi trường làm việc độc lập.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Phát triển kỹ năng:</strong> Hiểu được loại tính cách của mình giúp người dùng biết được những kỹ năng cần phát triển để thành công trong 
                công việc.
              </Typography>
              <Typography component="li" paragraph>
                <strong>Làm việc nhóm hiệu quả:</strong> Hiểu về các loại tính cách khác nhau giúp cải thiện khả năng làm việc nhóm và giao tiếp trong môi trường 
                chuyên nghiệp.
              </Typography>
            </Box>
            <Typography paragraph>
              Tuy nhiên, cần lưu ý rằng MBTI chỉ là một trong nhiều công cụ để hiểu về bản thân và định hướng nghề nghiệp. Kết quả MBTI nên được kết hợp với các 
              yếu tố khác như sở thích, giá trị, kỹ năng và kinh nghiệm để có được cái nhìn toàn diện về con đường sự nghiệp phù hợp.
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 