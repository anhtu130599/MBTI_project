'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUser(data);
    } catch {
      setError('Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchUserDetails();
    }
    checkAuth();
  }, [router, fetchUserDetails]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin người dùng</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/admin/users')}
        sx={{ mb: 2 }}
      >
        Quay lại danh sách người dùng
      </Button>

      <Typography variant="h4" gutterBottom>
        Chi tiết người dùng
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tên đăng nhập
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Vai trò
                </Typography>
                <Typography variant="body1">
                  {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái email
                </Typography>
                <Typography variant="body1">
                  {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin hoạt động
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày tạo tài khoản
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleString('vi-VN')}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Lần đăng nhập cuối
                </Typography>
                <Typography variant="body1">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('vi-VN')
                    : 'Chưa đăng nhập'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 