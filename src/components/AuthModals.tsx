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
  Alert,
  Snackbar,
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

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
    setError(null);
    setSuccess(null);
    setShowForgotPassword(false);
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
    setError(null);
    setSuccess(null);
    setShowForgotPassword(false);
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
    setError(null);
    setSuccess(null);
    setShowForgotPassword(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Vui lòng nhập email');
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setShowForgotPassword(false);
      } else {
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi yêu cầu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
        onClose();
        window.location.reload();
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } else if (activeTab === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }

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
        setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
        setTimeout(() => {
          onClose();
        }, 3000);
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
            {showForgotPassword ? 'Quên mật khẩu' : activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {!showForgotPassword && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Đăng nhập" value="login" />
            <Tab label="Đăng ký" value="register" />
          </Tabs>
        </Box>
      )}

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}>
          {showForgotPassword ? (
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
          ) : (
            <>
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
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    inputProps={{ minLength: 3 }}
                  />
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
                </>
              )}
              
              {activeTab === 'login' && (
                <TextField
                  margin="dense"
                  name="username"
                  label="Tên đăng nhập"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.username}
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
            </>
          )}

          <DialogActions>
            {activeTab === 'login' && !showForgotPassword && (
              <Button onClick={() => setShowForgotPassword(true)}>
                Quên mật khẩu?
              </Button>
            )}
            {showForgotPassword && (
              <Button onClick={() => setShowForgotPassword(false)}>
                Quay lại đăng nhập
              </Button>
            )}
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {showForgotPassword ? 'Gửi yêu cầu' : activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals; 