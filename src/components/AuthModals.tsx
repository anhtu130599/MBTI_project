import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

interface AuthModalsProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

const AuthModals: React.FC<AuthModalsProps> = ({ open, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Reset everything when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      username: '',
    });
  }, [initialTab]);

  const handleClose = () => {
    setActiveTab(initialTab);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      username: '',
    });
    onClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'login' | 'register') => {
    setActiveTab(newValue);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      username: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onClose(); // Đóng modal
        window.location.reload(); // Reload lại trang để Header đồng bộ trạng thái đăng nhập
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } else if (activeTab === 'register') {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onClose(); // Đóng modal
        window.location.reload(); // Reload lại trang để Header đồng bộ trạng thái đăng nhập
      } else {
        setError(data.error || 'Đăng ký thất bại');
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Đăng nhập" value="login" />
          <Tab label="Đăng ký" value="register" />
        </Tabs>
      </Box>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <>
              <TextField
                margin="dense"
                name="name"
                label="Họ và tên"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                name="username"
                label="Tên đăng nhập"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.username || ''}
                onChange={handleInputChange}
                required
                inputProps={{ minLength: 3 }}
              />
            </>
          )}
          {activeTab === 'login' ? (
            <TextField
              margin="dense"
              name="username"
              label="Tên đăng nhập"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          ) : (
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}
          <TextField
            margin="dense"
            name="password"
            label="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {activeTab === 'register' && (
            <TextField
              margin="dense"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          )}
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals; 