'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [submitError, setSubmitError] = useState('');

  // Reset form when component mounts or re-mounts
  useEffect(() => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setSubmitError('');
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập tên';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập họ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message || 'Đăng ký thất bại');
      } else {
        setSubmitError('Đã xảy ra lỗi không mong muốn.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        name="username"
        label="Tên đăng nhập"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        name="firstName"
        label="Tên"
        autoComplete="given-name"
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        name="lastName"
        label="Họ"
        autoComplete="family-name"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        name="email"
        label="Email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Mật khẩu"
        type="password"
        id="password"
        name="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Xác nhận mật khẩu"
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>
    </Box>
  );
};

export default RegisterForm; 