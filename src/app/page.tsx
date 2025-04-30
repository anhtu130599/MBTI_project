'use client';

import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Trắc nghiệm MBTI & Hướng nghiệp
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph align="center" sx={{ mb: 4 }}>
          Khám phá tính cách của bạn và tìm ra con đường sự nghiệp phù hợp
        </Typography>

        <Card sx={{ maxWidth: 600, width: '100%', mb: 4 }}>
          <CardContent>
            <Typography variant="body1" paragraph>
              Bài trắc nghiệm MBTI (Myers-Briggs Type Indicator) sẽ giúp bạn:
            </Typography>
            <ul>
              <li>Hiểu rõ hơn về tính cách của bản thân</li>
              <li>Khám phá điểm mạnh và điểm yếu</li>
              <li>Tìm ra nghề nghiệp phù hợp với tính cách</li>
              <li>Định hướng phát triển bản thân</li>
            </ul>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/test')}
          sx={{ mt: 2 }}
        >
          Bắt đầu trắc nghiệm
        </Button>
      </Box>
    </Container>
  );
} 