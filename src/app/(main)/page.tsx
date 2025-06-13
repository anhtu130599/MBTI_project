'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  Psychology, 
  Work, 
  Quiz, 
  TrendingUp 
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <Psychology color="primary" sx={{ fontSize: 48 }} />,
      title: 'Khám phá tính cách MBTI',
      description: 'Phân tích tính cách dựa trên 16 loại tính cách Myers-Briggs',
      action: 'Làm bài kiểm tra',
      path: '/test'
    },
    {
      icon: <Work color="primary" sx={{ fontSize: 48 }} />,
      title: 'Tư vấn nghề nghiệp',
      description: 'Gợi ý nghề nghiệp phù hợp với tính cách của bạn',
      action: 'Xem nghề nghiệp',
      path: '/careers'
    },
    {
      icon: <Quiz color="primary" sx={{ fontSize: 48 }} />,
      title: 'Tìm hiểu các loại tính cách',
      description: 'Khám phá đặc điểm của 16 loại tính cách MBTI',
      action: 'Khám phá ngay',
      path: '/personality-types'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 8
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              Trắc nghiệm MBTI & Hướng nghiệp
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Khám phá tính cách của bạn và tìm ra con đường sự nghiệp phù hợp
            </Typography>

            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              sx={{ mb: 4 }}
            >
              <Chip label="Miễn phí 100%" color="secondary" />
              <Chip label="Kết quả chính xác" color="secondary" />
              <Chip label="Tư vấn nghề nghiệp" color="secondary" />
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/test')}
              sx={{ 
                py: 2, 
                px: 4, 
                fontSize: '1.1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Bắt đầu trắc nghiệm ngay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Tính năng nổi bật
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push(feature.path)}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                16
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Loại tính cách
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                100+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Nghề nghiệp
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                95%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Độ chính xác
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                5 phút
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Thời gian test
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Sẵn sàng khám phá bản thân?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Chỉ mất 5 phút để có được kết quả phân tích tính cách chi tiết và gợi ý nghề nghiệp phù hợp
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/test')}
          startIcon={<TrendingUp />}
          sx={{ py: 1.5, px: 4 }}
        >
          Bắt đầu ngay
        </Button>
      </Container>
    </Box>
  );
} 