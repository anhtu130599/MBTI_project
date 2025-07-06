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
  MenuItem,
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
  requiredSkills: string[];
  industry: string;
  salaryRange: { min: number; max: number; currency: string };
  educationLevel: string;
  experienceLevel: string;
  workEnvironment: string;
  location: string;
  jobOutlook: string;
}

const experienceLevels = ['Entry', 'Mid', 'Senior', 'Executive'];
const currencyOptions = ['VND', 'USD', 'EUR'];

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
    requiredSkills: '',
    industry: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'VND',
    educationLevel: '',
    experienceLevel: '',
    workEnvironment: '',
    location: '',
    jobOutlook: '',
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
      if (!data.success || !data.data || data.data.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchCareers();
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    fetch('/api/personality-types')
      .then(res => res.json())
      .then(data => setMbtiTypes(data.map((t: { type: string }) => t.type)));
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/admin/careers', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch careers');
      const data = await response.json();
      setCareers(data);
    } catch {
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
      requiredSkills: '',
      industry: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'VND',
      educationLevel: '',
      experienceLevel: '',
      workEnvironment: '',
      location: '',
      jobOutlook: '',
    });
    setDialogOpen(true);
  };

  const handleEditClick = (career: Career) => {
    setSelectedCareer(career);
    setFormData({
      title: career.title,
      description: career.description,
      personalityTypes: career.personalityTypes.join('\n'),
      requiredSkills: career.requiredSkills.join('\n'),
      industry: career.industry,
      salaryMin: career.salaryRange.min.toString(),
      salaryMax: career.salaryRange.max.toString(),
      salaryCurrency: career.salaryRange.currency,
      educationLevel: career.educationLevel,
      experienceLevel: career.experienceLevel,
      workEnvironment: career.workEnvironment,
      location: career.location,
      jobOutlook: career.jobOutlook,
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
    } catch {
      setError('Lỗi khi xóa nghề nghiệp');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        personalityTypes: formData.personalityTypes.split('\n').filter(s => s.trim()),
        requiredSkills: formData.requiredSkills.split('\n').filter(s => s.trim()),
        industry: formData.industry,
        salaryRange: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
          currency: formData.salaryCurrency,
        },
        educationLevel: formData.educationLevel,
        experienceLevel: formData.experienceLevel,
        workEnvironment: formData.workEnvironment,
        location: formData.location,
        jobOutlook: formData.jobOutlook,
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
    } catch {
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
          <TextField label="Ngành nghề" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Kỹ năng cần thiết (mỗi dòng 1 kỹ năng)" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} fullWidth margin="normal" multiline minRows={2} required />
          <TextField label="Trình độ học vấn" value={formData.educationLevel} onChange={e => setFormData({ ...formData, educationLevel: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Cấp bậc kinh nghiệm" value={formData.experienceLevel} onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })} fullWidth margin="normal" select required >
            {experienceLevels.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
          </TextField>
          <TextField label="Mức lương tối thiểu" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: e.target.value })} fullWidth margin="normal" type="number" required />
          <TextField label="Mức lương tối đa" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: e.target.value })} fullWidth margin="normal" type="number" required />
          <TextField label="Đơn vị tiền tệ" value={formData.salaryCurrency} onChange={e => setFormData({ ...formData, salaryCurrency: e.target.value })} fullWidth margin="normal" select required >
            {currencyOptions.map(cur => <MenuItem key={cur} value={cur}>{cur}</MenuItem>)}
          </TextField>
          <TextField label="Môi trường làm việc" value={formData.workEnvironment} onChange={e => setFormData({ ...formData, workEnvironment: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Địa điểm" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Triển vọng nghề nghiệp" value={formData.jobOutlook} onChange={e => setFormData({ ...formData, jobOutlook: e.target.value })} fullWidth margin="normal" required />
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