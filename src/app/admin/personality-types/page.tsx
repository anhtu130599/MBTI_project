'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface PersonalityType {
  _id: string;
  type: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

export default function AdminPersonalityTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<PersonalityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PersonalityType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    strengths: '',
    weaknesses: '',
    careers: '',
  });

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!data.success || !data.data || data.data.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchTypes();
    }
    checkAuth();
  }, [router]);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/admin/personality-types', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch types');
      const data = await response.json();
      setTypes(data);
    } catch {
      setError('Lỗi khi tải danh sách loại tính cách');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (type: PersonalityType) => {
    setSelectedType(type);
    setFormData({
      type: type.type,
      title: type.title,
      description: type.description,
      strengths: type.strengths.join('\n'),
      weaknesses: type.weaknesses.join('\n'),
      careers: type.careers.join('\n'),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      setError('Không có loại tính cách được chọn');
      return;
    }

    try {
      const data = {
        ...formData,
        strengths: formData.strengths.split('\n').filter(s => s.trim()),
        weaknesses: formData.weaknesses.split('\n').filter(s => s.trim()),
        careers: formData.careers.split('\n').filter(s => s.trim()),
      };

      const response = await fetch(`/api/admin/personality-types/${selectedType._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save type');

      const savedType = await response.json();
      setTypes(types.map(type => 
        type._id === selectedType._id ? savedType : type
      ));
      setDialogOpen(false);
    } catch {
      setError('Lỗi khi lưu loại tính cách');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý loại tính cách
        </Typography>
        <Typography variant="body2" color="text.secondary">
          MBTI có cố định 16 loại tính cách. Bạn chỉ có thể chỉnh sửa thông tin mô tả, không thể thêm mới hoặc xóa loại tính cách.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type._id}>
                <TableCell>{type.type}</TableCell>
                <TableCell>{type.title}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(type)}
                    color="primary"
                    size="small"
                    title="Chỉnh sửa thông tin"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chỉnh sửa thông tin loại tính cách
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Loại tính cách"
            fullWidth
            value={formData.type}
            disabled
            helperText="Loại tính cách không thể thay đổi do nghiệp vụ MBTI"
          />
          <TextField
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Điểm mạnh (mỗi dòng một điểm)"
            fullWidth
            multiline
            rows={3}
            value={formData.strengths}
            onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Điểm yếu (mỗi dòng một điểm)"
            fullWidth
            multiline
            rows={3}
            value={formData.weaknesses}
            onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nghề nghiệp phù hợp (mỗi dòng một nghề)"
            fullWidth
            multiline
            rows={3}
            value={formData.careers}
            onChange={(e) => setFormData({ ...formData, careers: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 