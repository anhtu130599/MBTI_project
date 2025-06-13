'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  People, 
  Quiz, 
  Psychology,
  Work,
  TrendingUp, 
  AdminPanelSettings 
} from '@mui/icons-material';

interface AdminStats {
  totalUsers: number;
  totalTestsCompleted: number;
  totalQuestions: number;
  totalPersonalityTypes: number;
  totalCareers: number;
  recentTestsCount: number;
  growthPercentage: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Không thể tải dữ liệu thống kê');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AdminPanelSettings />
        Tổng quan hệ thống
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People color="primary" />
                <Box>
                  <Typography variant="h6">Người dùng</Typography>
                  <Typography variant="h4">{stats?.totalUsers || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số tài khoản
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Quiz color="secondary" />
                <Box>
                  <Typography variant="h6">Bài test hoàn thành</Typography>
                  <Typography variant="h4">{stats?.totalTestsCompleted || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số lượt làm bài
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Psychology color="success" />
                <Box>
                  <Typography variant="h6">Câu hỏi</Typography>
                  <Typography variant="h4">{stats?.totalQuestions || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Câu hỏi trong hệ thống
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Work color="warning" />
                <Box>
                  <Typography variant="h6">Nghề nghiệp</Typography>
                  <Typography variant="h4">{stats?.totalCareers || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gợi ý nghề nghiệp
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hoạt động gần đây
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="h4" color="success.main">
                  +{stats?.growthPercentage || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tăng trưởng tháng này
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1">
              {stats?.recentTestsCount || 0} bài test được hoàn thành trong 30 ngày qua
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chào mừng đến với bảng điều khiển quản trị
            </Typography>
            <Typography variant="body1" paragraph>
              Đây là trung tâm quản lý hệ thống MBTI Career Test. Sử dụng menu điều hướng bên trái để truy cập các chức năng quản trị khác nhau.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Quản lý người dùng và phân quyền<br/>
              • Quản lý câu hỏi và bài test<br/>
              • Quản lý thông tin nghề nghiệp<br/>
              • Cập nhật thông tin loại tính cách
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 