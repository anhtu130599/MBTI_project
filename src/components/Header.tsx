'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthModals from './AuthModals';

const Header = () => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Lấy user từ localStorage nếu có
    const storedUser = localStorage.getItem('mbti_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    // Lắng nghe sự kiện storage để cập nhật user khi đăng xuất ở tab khác
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('mbti_user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authModalOpen]);

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
    // Sau khi modal đóng, reload user
    const storedUser = localStorage.getItem('mbti_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('mbti_user');
    setUser(null);
    setAnchorEl(null);
    router.push('/');
  };

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
              {user ? (
                <>
                  <IconButton onClick={handleAvatarClick} size="small">
                    <Avatar>{user.username ? user.username[0].toUpperCase() : '?'}</Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem disabled>{user.username}</MenuItem>
                    {user.role === 'admin' && (
                      <MenuItem onClick={() => { router.push('/admin'); setAnchorEl(null); }}>
                        Trang quản trị
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={handleLogin}>
                    Đăng nhập
                  </Button>
                  <Button color="inherit" onClick={handleRegister}>
                    Đăng ký
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AuthModals
        open={authModalOpen}
        onClose={handleCloseAuthModal}
        initialTab={authModalTab}
      />
    </Box>
  );
};

export default Header; 