'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        onLogout();
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <Avatar sx={{ width: 32, height: 32 }}>
          {user?.username ? user.username[0].toUpperCase() : '?'}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem disabled>{user?.username}</MenuItem>
        <MenuItem onClick={() => router.push('/profile')}>
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={() => router.push('/change-password')}>
          Đổi mật khẩu
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={() => router.push('/admin')}>
            Trang quản trị
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 