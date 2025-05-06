import React, { useState } from 'react';
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
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'login' | 'register') => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic đăng nhập/đăng ký ở đây
    console.log('Form submitted:', formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Typography>
          <IconButton onClick={onClose} size="small">
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
          )}
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
            <Button onClick={onClose}>Hủy</Button>
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