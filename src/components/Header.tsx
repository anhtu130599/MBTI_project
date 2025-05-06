'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';
import AuthModals from './AuthModals';

const Header = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
    handleClose();
  };

  const handleRegister = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
    handleClose();
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
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
            </Box>

            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogin}>Đăng nhập</MenuItem>
                <MenuItem onClick={handleRegister}>Đăng ký</MenuItem>
              </Menu>
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