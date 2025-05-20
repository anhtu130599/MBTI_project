"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Container, Button, TextField, CircularProgress, Paper } from '@mui/material';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<any>(null);
  const [resultLoading, setResultLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setEditName(data.user.name || '');
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchLastResult() {
      setResultLoading(true);
      try {
        const res = await fetch('/api/test/last', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setLastResult(data);
        } else {
          setLastResult(null);
        }
      } catch {
        setLastResult(null);
      }
      setResultLoading(false);
    }
    fetchLastResult();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            Bạn cần đăng nhập để xem hồ sơ cá nhân.
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditName(user.name || '');
    setMessage('');
  };

  const handleSave = async () => {
    // TODO: Gọi API cập nhật thông tin user thực tế
    setEditMode(false);
    setMessage('Cập nhật hồ sơ thành công! (Chức năng này sẽ cập nhật qua API trong tương lai)');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
          {user.username ? user.username[0].toUpperCase() : '?'}
        </Avatar>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Hồ sơ người dùng</Typography>
            <Typography><b>Tên đăng nhập:</b> {user.username}</Typography>
            <Typography><b>Email:</b> {user.email}</Typography>
            {editMode ? (
              <TextField
                label="Họ và tên"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                fullWidth
                margin="dense"
              />
            ) : (
              user.name && <Typography><b>Họ và tên:</b> {user.name}</Typography>
            )}
            {user.createdAt && (
              <Typography><b>Ngày tạo:</b> {new Date(user.createdAt).toLocaleDateString()}</Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {editMode ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
                  <Button variant="outlined" onClick={handleCancel}>Hủy</Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEdit}>Chỉnh sửa</Button>
              )}
            </Box>
            {message && <Typography color="success.main" sx={{ mt: 1 }}>{message}</Typography>}
          </CardContent>
        </Card>
        <Paper sx={{ mt: 4, p: 2, width: '100%', maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>Kết quả MBTI cuối cùng</Typography>
          {resultLoading ? (
            <Typography color="text.secondary">Đang tải...</Typography>
          ) : lastResult ? (
            <>
              <Typography><b>Loại MBTI:</b> {lastResult.personalityType}</Typography>
              <Typography><b>Ngày làm:</b> {new Date(lastResult.timestamp).toLocaleString()}</Typography>
              <Typography><b>Gợi ý nghề nghiệp:</b></Typography>
              <ul>
                {lastResult.careerRecommendations.map((career: string, idx: number) => (
                  <li key={idx}>{career}</li>
                ))}
              </ul>
            </>
          ) : (
            <Typography color="text.secondary">Chưa có kết quả MBTI nào.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 