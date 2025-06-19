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
  Box,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/core/domain/entities';
import { ROUTES } from '@/shared/constants';

interface UserMenuProps {
  user: UserResponse | {
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
  
  const handleNavigate = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return '';
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {user.firstName ? getInitials(user.firstName, user.lastName) : <AccountCircle />}
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
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 240,
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">{getDisplayName()}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate(ROUTES.PROFILE)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hồ sơ của tôi</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleNavigate(ROUTES.SETTINGS_PROFILE)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cài đặt tài khoản</ListItemText>
        </MenuItem>

        {user.role === 'admin' && (
          <MenuItem onClick={() => handleNavigate(ROUTES.ADMIN)}>
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Trang quản trị</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 