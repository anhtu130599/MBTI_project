'use client';

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
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
        <Box mt={3}>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </Box>
      </Paper>
    </Container>
  );
}; 