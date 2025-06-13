'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Box, Link, Alert } from '@mui/material';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/constants';

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => Promise<void>;
  isLoading: boolean;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Reset form when component mounts or re-mounts
  useEffect(() => {
    setFormData({
      username: '',
      password: '',
    });
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Tên đăng nhập"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        margin="normal"
        required
        autoComplete="username"
        helperText="Nhập tên đăng nhập của bạn"
      />
      
      <TextField
        fullWidth
        label="Mật khẩu"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
        autoComplete="current-password"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        isLoading={isLoading}
        sx={{ mt: 3, mb: 2 }}
      >
        Đăng nhập
      </Button>

      <Box textAlign="center">
        <Link href={ROUTES.RESET_PASSWORD} variant="body2">
          Quên mật khẩu?
        </Link>
        {' | '}
        <Link href={ROUTES.REGISTER} variant="body2">
          Chưa có tài khoản? Đăng ký
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm; 