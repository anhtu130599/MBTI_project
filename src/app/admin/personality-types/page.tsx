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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchTypes();
    }
    checkAuth();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/admin/personality-types', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch types');
      const data = await response.json();
      setTypes(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách loại tính cách');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedType(null);
    setFormData({
      type: '',
      title: '',
      description: '',
      strengths: '',
      weaknesses: '',
      careers: '',
    });
    setDialogOpen(true);
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

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa loại tính cách này?')) return;

    try {
      const response = await fetch(`/api/admin/personality-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete type');

      setTypes(types.filter(type => type._id !== id));
    } catch (err) {
      setError('Lỗi khi xóa loại tính cách');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        strengths: formData.strengths.split('\n').filter(s => s.trim()),
        weaknesses: formData.weaknesses.split('\n').filter(s => s.trim()),
        careers: formData.careers.split('\n').filter(s => s.trim()),
      };

      const response = await fetch(
        selectedType
          ? `/api/admin/personality-types/${selectedType._id}`
          : '/api/admin/personality-types',
        {
          method: selectedType ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Failed to save type');

      const savedType = await response.json();
      if (selectedType) {
        setTypes(types.map(type => 
          type._id === selectedType._id ? savedType : type
        ));
      } else {
        setTypes([...types, savedType]);
      }
      setDialogOpen(false);
    } catch (err) {
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        onClick={() => router.push('/admin')}
        sx={{ mb: 2 }}
      >
        Quay lại trang quản trị
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý loại tính cách
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Thêm mới
        </Button>
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
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(type._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedType ? 'Chỉnh sửa loại tính cách' : 'Thêm loại tính cách mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Loại"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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