'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Psychology as PsychologyIcon,
  BarChart as ChartIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

interface AdminStats {
  userCount: number;
  testCount: number;
  popularTypes: Array<{
    type: string;
    count: number;
  }>;
  recentTests: Array<{
    id: string;
    personalityType: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu không có quyền, chuyển hướng đến trang đăng nhập
            router.push('/login');
            return;
          }
          throw new Error('Không thể tải dữ liệu');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      router.push('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bảng điều khiển quản trị
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Thống kê người dùng */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Người dùng" 
              avatar={<PeopleIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="h3" align="center">
                {stats?.userCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Tổng số người dùng đã đăng ký
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê bài test */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Bài test" 
              avatar={<PsychologyIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="h3" align="center">
                {stats?.testCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Tổng số bài test đã hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Loại tính cách phổ biến */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Tính cách phổ biến" 
              avatar={<ChartIcon color="primary" />}
            />
            <CardContent>
              {stats?.popularTypes && stats.popularTypes.length > 0 ? (
                <List dense>
                  {stats.popularTypes.map((item, index) => (
                    <ListItem key={item.type} divider={index < stats.popularTypes.length - 1}>
                      <ListItemText 
                        primary={item.type} 
                        secondary={`${item.count} người dùng`} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Chưa có dữ liệu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bài test gần đây */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Bài test gần đây" />
            <CardContent>
              {stats?.recentTests && stats.recentTests.length > 0 ? (
                <List>
                  {stats.recentTests.map((test, index) => (
                    <>
                      <ListItem>
                        <ListItemText
                          primary={`Loại tính cách: ${test.personalityType}`}
                          secondary={`Thời gian: ${new Date(test.createdAt).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < stats.recentTests.length - 1 && <Divider />}
                    </>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Chưa có bài test nào
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => router.push('/admin/users')}>
          Quản lý người dùng
        </Button>
        <Button variant="contained" onClick={() => router.push('/admin/test-results')}>
          Xem kết quả test
        </Button>
      </Box>
    </Container>
  );
} 