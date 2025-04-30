'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose();
    router.push('/login');
  };

  const handleRegister = () => {
    handleClose();
    router.push('/register');
  };

  return (
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

          <Box sx={{ ml: 2 }}>
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
  );
} 