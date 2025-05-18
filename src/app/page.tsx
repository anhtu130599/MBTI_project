'use client';

import { Box, Container, Typography, Button } from '@mui/material';
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