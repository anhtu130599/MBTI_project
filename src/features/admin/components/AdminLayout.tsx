'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
  Button,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { 
  Dashboard, 
  People, 
  Quiz, 
  Work,
  Psychology,
  Menu as MenuIcon,
  ChevronLeft,
  Home as HomeIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const menuItems = [
  { text: 'Tổng quan', href: '/admin', icon: <Dashboard /> },
  { text: 'Người dùng', href: '/admin/users', icon: <People /> },
  { text: 'Câu hỏi', href: '/admin/questions', icon: <Quiz /> },
  { text: 'Nghề nghiệp', href: '/admin/careers', icon: <Work /> },
  { text: 'Loại tính cách', href: '/admin/personality-types', icon: <Psychology /> },
];

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        if (data.success && data.data) {
          const userData = data.data;
          if (userData.role !== 'admin') {
            setError('Truy cập bị từ chối. Bạn cần có quyền quản trị viên.');
            return;
          }
          setUser(userData);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setError('Không thể xác thực quyền truy cập. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => router.push('/login')}>
          Đăng nhập lại
        </Button>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">
          Bạn cần đăng nhập để truy cập trang quản trị.
        </Alert>
        <Button variant="contained" onClick={() => router.push('/login')} sx={{ mt: 2 }}>
          Đăng nhập
        </Button>
      </Container>
    );
  }

  const currentDrawerWidth = open ? drawerWidth : collapsedDrawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${currentDrawerWidth}px)`,
          ml: `${currentDrawerWidth}px`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Bảng điều khiển quản trị
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Xin chào, {user.username}
          </Typography>
          <Tooltip title="Về trang chủ MBTI">
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{ ml: 2 }}
            >
              Trang chủ
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              MBTI Admin
            </Typography>
          )}
        </Toolbar>
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <Tooltip 
              key={item.text}
              title={!open ? item.text : ''}
              placement="right"
            >
              <ListItem
                component={Link}
                href={item.href}
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  backgroundColor: pathname === item.href ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: 'width 0.3s',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 