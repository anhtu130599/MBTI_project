'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, CircularProgress, Alert, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants';

// Interface cho user từ API
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Interface cho test history từ API
interface TestHistoryItem {
  id: string;
  personalityType: string;
  type: string;
  scores: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  percentages: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  careerRecommendations: string[];
  totalQuestions: number;
  createdAt: string;
  timestamp: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy thông tin user
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include', // Include cookies
        });
        
        let userData = null;
        if (userResponse.ok) {
          const userResult = await userResponse.json();
          // API trả về { success: true, data: user }
          if (userResult.success && userResult.data) {
            userData = userResult.data;
            setUser(userData);
          } else {
            throw new Error('Invalid response format');
          }
        } else {
          throw new Error('Không thể tải thông tin người dùng');
        }

        // Gọi API để lấy lịch sử làm bài
        const historyResponse = await fetch('/api/users/test-history', {
          credentials: 'include', // Include cookies
        });
        
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          // API trả về array trực tiếp thay vì { data }
          setTestHistory(Array.isArray(historyData) ? historyData : []);
        } else {
          // Nếu không lấy được history, vẫn hiển thị thông tin user
          setTestHistory([]);
        }
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Hồ sơ của bạn
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thông tin cá nhân</Typography>
              <Divider sx={{ my: 2 }} />
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : user ? (
                <Box>
                  <Typography variant="body1"><strong>Tên người dùng:</strong> {user.username}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> {user.email}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}><strong>Vai trò:</strong> {user.role}</Typography>
                  {user.emailVerified !== undefined && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email đã xác thực:</strong> {user.emailVerified ? 'Có' : 'Chưa'}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Tham gia:</strong> {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">Không thể tải thông tin</Typography>
              )}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button component={Link} href={ROUTES.SETTINGS_PROFILE} variant="contained">
                  Chỉnh sửa hồ sơ
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Lịch sử làm bài</Typography>
              <Divider sx={{ my: 2 }} />
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="warning">Không thể tải lịch sử làm bài</Alert>
              ) : testHistory.length > 0 ? (
                <List>
                  {testHistory.map((result, index) => (
                    <React.Fragment key={result.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6">
                                Loại tính cách: <strong>{result.personalityType}</strong>
                              </Typography>
                              <Chip 
                                label={`${result.totalQuestions} câu hỏi`} 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Làm bài lúc: {new Date(result.createdAt).toLocaleString('vi-VN')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Nghề nghiệp phù hợp:</strong> {result.careerRecommendations.slice(0, 3).join(', ')}
                                {result.careerRecommendations.length > 3 && '...'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button 
                            component={Link} 
                            href={`${ROUTES.TEST_RESULT}?type=${result.personalityType}`} 
                            variant="outlined"
                            size="small"
                          >
                            Xem chi tiết
                          </Button>
                        </Box>
                      </ListItem>
                      {index < testHistory.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>Bạn chưa có lịch sử làm bài nào.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 