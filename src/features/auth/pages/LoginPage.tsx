'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useSearchParams } from 'next/navigation';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();

  // Lưu redirect parameter vào sessionStorage khi component mount
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      sessionStorage.setItem('returnUrl', redirect);
      console.log('🔗 Saved redirect URL to sessionStorage:', redirect);
    }
  }, [searchParams]);

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already handled in useAuth hook
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Đăng nhập
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          Chào mừng bạn quay trở lại!
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box mt={3}>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </Box>
      </Paper>
    </Container>
  );
}; 