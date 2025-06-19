'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, CircularProgress, Alert, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { userService } from '@/features/user/services/userService';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants';

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
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, historyResponse] = await Promise.all([
          fetch('/api/auth/me'),
          userService.getTestHistory()
        ]);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        }
        
        setTestHistory(historyResponse.data || []);
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
              {user ? (
                <Box>
                  <Typography variant="body1"><strong>Họ và tên:</strong> {user.name}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> {user.email}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}><strong>Vai trò:</strong> {user.role}</Typography>
                </Box>
              ) : (
                <CircularProgress />
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
                <Alert severity="error">{error}</Alert>
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