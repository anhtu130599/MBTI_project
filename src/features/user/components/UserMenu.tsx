'use client';

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleAdminClick = () => {
    handleMenuClose();
    router.push('/admin');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    router.push('/settings');
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
  };

  // Tạo initials từ firstName/lastName hoặc fallback về username
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    } else {
      return user.username.charAt(0).toUpperCase();
    }
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {getInitials()}
        </Avatar>
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
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hồ sơ</ListItemText>
        </MenuItem>
        
        {/* Chỉ hiển thị cho admin */}
        {user.role === 'admin' && (
          <>
            <MenuItem onClick={handleAdminClick}>
              <ListItemIcon>
                <AdminIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Admin Dashboard</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
        
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cài đặt</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 