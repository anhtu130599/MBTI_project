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
  code: string;
  name: string;
  description: string;
  strengths: Array<{
    title: string;
    description: string;
    why_explanation: string;
  }>;
  weaknesses: Array<{
    title: string;
    description: string;
    why_explanation: string;
    improvement_advice: string;
  }>;
}

export default function AdminPersonalityTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<PersonalityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PersonalityType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
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
    console.log('Edit personality type:', type);
    if (!type || !type._id) {
      setError('Không thể sửa: Dữ liệu loại tính cách bị thiếu hoặc lỗi.');
      return;
    }
    setSelectedType(type);
    setFormData({
      code: type.code || '',
      name: type.name || '',
      description: type.description || '',
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
        code: formData.code,
        name: formData.name,
        description: formData.description,
      };

      const response = await fetch(`/api/admin/personality-types/${selectedType._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to save type');

      const savedType = await response.json();
      
      // Update the types list with the new data
      setTypes(types.map(type => 
        type._id === selectedType._id ? {
          ...type,
          code: savedType.type || savedType.code,
          name: savedType.name,
          description: savedType.description,
        } : type
      ));
      
      setDialogOpen(false);
      setError(null);
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
          MBTI có cố định 16 loại tính cách. Bạn chỉ có thể chỉnh sửa tên và mô tả cơ bản. 
          Các thông tin chi tiết khác (điểm mạnh, điểm yếu, lời khuyên) cần được chỉnh sửa trực tiếp trong database.
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
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell width="100">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type._id}>
                <TableCell>{type.code}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {type.description}
                  </Typography>
                </TableCell>
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
            label="Mã loại tính cách"
            fullWidth
            value={formData.code}
            disabled
            helperText="Mã loại tính cách không thể thay đổi do nghiệp vụ MBTI"
          />
          <TextField
            margin="dense"
            label="Tên"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="Tên ngắn gọn của loại tính cách (ví dụ: Người truyền cảm hứng)"
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            helperText="Mô tả chi tiết về loại tính cách này"
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