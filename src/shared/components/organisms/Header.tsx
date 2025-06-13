'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { AuthModals } from '@/features/auth/components/AuthModals';
import { UserMenu } from '@/features/user/components/UserMenu';

export const Header: React.FC = () => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { 
        credentials: 'include',
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const handleLoginSuccess = async () => {
    await fetchUser();
    setAuthModalOpen(false);
  };

  const handleRegisterSuccess = async () => {
    setAuthModalOpen(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              MBTI Test
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => router.push('/about')}>
                Giới thiệu
              </Button>
              <Button color="inherit" onClick={() => router.push('/test')}>
                Làm bài kiểm tra
              </Button>
              <Button color="inherit" onClick={() => router.push('/personality-types')}>
                Các loại tính cách
              </Button>
              <Button color="inherit" onClick={() => router.push('/careers')}>
                Danh sách nghề nghiệp
              </Button>
              
              {!loading && (user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Button color="inherit" onClick={handleLogin}>
                    Đăng nhập
                  </Button>
                  <Button color="inherit" onClick={handleRegister}>
                    Đăng ký
                  </Button>
                </>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AuthModals
        open={authModalOpen}
        onClose={handleCloseAuthModal}
        initialTab={authModalTab}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </Box>
  );
};

export default Header; 