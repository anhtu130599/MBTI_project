'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Psychology,
  Timer,
  QuestionAnswer,
  CheckCircle,
  Info,
  TrendingUp,
  Work,
  Group,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { testService, QuestionStats } from '../services/testService';

export const TestIntroduction: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const questionStats = await testService.getQuestionStats();
        setStats(questionStats);
      } catch (err) {
        setError('Không thể tải thông tin bài test. Vui lòng thử lại.');
        console.error('Error fetching question stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleStartTest = async () => {
    // Kiểm tra trạng thái đăng nhập trước khi bắt đầu test
    try {
      const response = await fetch('/api/auth/me');
      const isLoggedIn = response.ok;
      
      // Lưu trạng thái đăng nhập vào sessionStorage
      if (isLoggedIn) {
        sessionStorage.setItem('wasGuestUser', 'false');
        console.log('🔑 User is logged in, will require manual save');
      } else {
        sessionStorage.setItem('wasGuestUser', 'true');
        console.log('👤 User is guest, will auto-save after login');
      }
    } catch {
      // Nếu không thể kiểm tra, mặc định là guest user
      sessionStorage.setItem('wasGuestUser', 'true');
      console.log('👤 Cannot check auth status, defaulting to guest user');
    }
    
    router.push('/test/questions');
  };

  const categoryDescriptions = {
    EI: { name: 'Hướng ngoại - Hướng nội', description: 'Đánh giá nguồn năng lượng và cách tương tác' },
    SN: { name: 'Cảm giác - Trực giác', description: 'Đánh giá cách thu thập thông tin' },
    TF: { name: 'Tư duy - Cảm xúc', description: 'Đánh giá cách đưa ra quyết định' },
    JP: { name: 'Phán đoán - Nhận thức', description: 'Đánh giá lối sống và cách tổ chức' },
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Psychology sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Bài Kiểm Tra Tính Cách MBTI
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Khám phá tính cách và tìm hiểu nghề nghiệp phù hợp với bạn
        </Typography>
      </Box>

      {/* Test Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
            Thông tin về bài test
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <QuestionAnswer sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats?.totalQuestions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Câu hỏi
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Timer sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats?.estimatedTime || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phút (ước tính)
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  16
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loại tính cách
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Question Categories */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
            Các nhóm câu hỏi
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Bài test được chia thành 4 nhóm chính để đánh giá các khía cạnh khác nhau của tính cách:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(categoryDescriptions).map(([key, category]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Chip
                    label={`${stats?.categories[key as keyof typeof stats.categories] || 0} câu`}
                    size="small"
                    color="primary"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {category.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
            Hướng dẫn làm bài
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Trả lời thành thật"
                secondary="Chọn câu trả lời phản ánh đúng nhất tính cách tự nhiên của bạn"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Không có câu trả lời đúng sai"
                secondary="Mỗi lựa chọn đều có giá trị riêng và phản ánh khía cạnh khác nhau của tính cách"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Dành đủ thời gian"
                secondary="Đọc kỹ câu hỏi và suy nghĩ trước khi chọn đáp án"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Môi trường yên tĩnh"
                secondary="Tìm nơi yên tĩnh để tập trung hoàn toàn vào bài test"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
            Bạn sẽ nhận được gì?
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Psychology color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Phân tích tính cách chi tiết"
                secondary="Hiểu rõ điểm mạnh, điểm yếu và đặc điểm tính cách của bạn"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Work color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Gợi ý nghề nghiệp phù hợp"
                secondary="Danh sách các nghề nghiệp phù hợp với tính cách và năng lực của bạn"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <TrendingUp color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Hướng phát triển cá nhân"
                secondary="Lời khuyên để phát triển bản thân và cải thiện những điểm còn hạn chế"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Start Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleStartTest}
          sx={{ 
            px: 6, 
            py: 2, 
            fontSize: '1.2rem',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          Bắt đầu làm bài test
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Thời gian ước tính: {stats?.estimatedTime || 0} phút
        </Typography>
      </Box>
    </Container>
  );
}; 