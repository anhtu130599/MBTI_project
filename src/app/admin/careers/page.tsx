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
import Autocomplete from '@mui/material/Autocomplete';

interface Career {
  _id: string;
  title: string;
  description: string;
  personalityTypes: string[];
  skills: string[];
  education: string;
  salary: string;
}

export default function AdminCareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    personalityTypes: '',
    skills: '',
    education: '',
    salary: '',
  });
  const [mbtiTypes, setMbtiTypes] = useState<string[]>([]);

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
      fetchCareers();
    }
    checkAuth();
  }, []);

  useEffect(() => {
    fetch('/api/personality-types')
      .then(res => res.json())
      .then(data => setMbtiTypes(data.map((t: any) => t.type)));
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/admin/careers', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch careers');
      const data = await response.json();
      setCareers(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách nghề nghiệp');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedCareer(null);
    setFormData({
      title: '',
      description: '',
      personalityTypes: '',
      skills: '',
      education: '',
      salary: '',
    });
    setDialogOpen(true);
  };

  const handleEditClick = (career: Career) => {
    setSelectedCareer(career);
    setFormData({
      title: career.title,
      description: career.description,
      personalityTypes: career.personalityTypes.join('\n'),
      skills: career.skills.join('\n'),
      education: career.education || '',
      salary: career.salary || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nghề nghiệp này?')) return;

    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete career');

      setCareers(careers.filter(career => career._id !== id));
    } catch (err) {
      setError('Lỗi khi xóa nghề nghiệp');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        personalityTypes: formData.personalityTypes.split('\n').filter(s => s.trim()),
        skills: formData.skills.split('\n').filter(s => s.trim()),
      };

      const response = await fetch(
        selectedCareer
          ? `/api/admin/careers/${selectedCareer._id}`
          : '/api/admin/careers',
        {
          method: selectedCareer ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        }
      );

      if (!response.ok) throw new Error('Failed to save career');

      const savedCareer = await response.json();
      if (selectedCareer) {
        setCareers(careers.map(career => 
          career._id === selectedCareer._id ? savedCareer : career
        ));
      } else {
        setCareers([...careers, savedCareer]);
      }
      setDialogOpen(false);
    } catch (err) {
      setError('Lỗi khi lưu nghề nghiệp');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý nghề nghiệp
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
              <TableCell>Tên nghề</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Loại tính cách phù hợp</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {careers.map((career) => (
              <TableRow key={career._id}>
                <TableCell>{career.title}</TableCell>
                <TableCell>{career.description}</TableCell>
                <TableCell>{career.personalityTypes.join(', ')}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(career)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(career._id)}
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
          {selectedCareer ? 'Chỉnh sửa nghề nghiệp' : 'Thêm nghề nghiệp mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên nghề"
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
          <Autocomplete
            multiple
            freeSolo
            options={mbtiTypes}
            value={formData.personalityTypes ? formData.personalityTypes.split('\n').filter(Boolean) : []}
            onChange={(_, value) => setFormData({ ...formData, personalityTypes: value.join('\n') })}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Loại tính cách phù hợp (chọn hoặc nhập, mỗi dòng một loại)"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />
          <TextField
            margin="dense"
            label="Kỹ năng cần thiết (mỗi dòng một kỹ năng)"
            fullWidth
            multiline
            rows={3}
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Yêu cầu học vấn"
            fullWidth
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mức lương"
            fullWidth
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
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