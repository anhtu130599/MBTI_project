'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../hooks/useAuth';

interface AuthModalsProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  open,
  onClose,
  initialTab = 'login',
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const { login, isLoading } = useAuth();

  // Reset activeTab when initialTab changes or modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'login' | 'register') => {
    setActiveTab(newValue);
  };

  const handleLogin = async (data: { username: string; password: string }) => {
    await login(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Đăng nhập" value="login" />
          <Tab label="Đăng ký" value="register" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {activeTab === 'login' ? (
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
              onSuccess={onLoginSuccess} 
            />
          ) : (
            <RegisterForm onSuccess={onRegisterSuccess} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals; 