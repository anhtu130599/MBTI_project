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
  Work as WorkIcon,
  Category as CategoryIcon
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
        const response = await fetch('/api/admin/stats', { credentials: 'include' });
        
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
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/admin/users')}
                >
                  Quản lý người dùng
                </Button>
              </Box>
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
              title="Loại tính cách phổ biến" 
              avatar={<ChartIcon color="primary" />}
            />
            <CardContent>
              <List>
                {stats?.popularTypes.slice(0, 5).map((type) => (
                  <ListItem key={type.type}>
                    <ListItemText
                      primary={type.type}
                      secondary={`${type.count} người dùng`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quản lý loại tính cách */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Quản lý loại tính cách" 
              avatar={<CategoryIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Quản lý thông tin chi tiết về các loại tính cách MBTI, bao gồm mô tả, điểm mạnh, điểm yếu và nghề nghiệp phù hợp.
              </Typography>
              <Button
                variant="contained"
                startIcon={<CategoryIcon />}
                onClick={() => router.push('/admin/personality-types')}
                fullWidth
              >
                Chỉnh sửa danh sách loại tính cách
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quản lý nghề nghiệp */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Quản lý nghề nghiệp" 
              avatar={<WorkIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Quản lý thông tin về các nghề nghiệp phù hợp với từng loại tính cách, bao gồm mô tả, kỹ năng cần thiết và yêu cầu học vấn.
              </Typography>
              <Button
                variant="contained"
                startIcon={<WorkIcon />}
                onClick={() => router.push('/admin/careers')}
                fullWidth
              >
                Chỉnh sửa danh sách nghề nghiệp
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quản lý câu hỏi MBTI */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Quản lý câu hỏi MBTI" 
              avatar={<PsychologyIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Quản lý nội dung câu hỏi và đáp án cho bài test MBTI. Có thể thêm, sửa, xóa và ẩn/hiện từng câu hỏi.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PsychologyIcon />}
                onClick={() => router.push('/admin/questions')}
                fullWidth
              >
                Chỉnh sửa câu hỏi MBTI
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
      </Box>
    </Container>
  );
} 