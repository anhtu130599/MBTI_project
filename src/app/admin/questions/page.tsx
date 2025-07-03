'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, List, ListItem, ListItemText, ListItemSecondaryAction, 
  Alert, Stack, Tabs, Tab, Paper, Chip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';

const VALUE_OPTIONS = [
  { label: 'E (Hướng ngoại)', value: 'E' },
  { label: 'I (Hướng nội)', value: 'I' },
  { label: 'S (Cảm nhận)', value: 'S' },
  { label: 'N (Trực giác)', value: 'N' },
  { label: 'T (Lý trí)', value: 'T' },
  { label: 'F (Cảm xúc)', value: 'F' },
  { label: 'J (Nguyên tắc)', value: 'J' },
  { label: 'P (Linh hoạt)', value: 'P' },
];

// 4 xu hướng tính cách đối lập
const DIMENSION_TABS = [
  {
    id: 'EI',
    label: 'Hướng ngoại - Hướng nội (E/I)',
    description: 'Câu hỏi đánh giá xu hướng tương tác với thế giới bên ngoài',
    values: ['E', 'I'],
    color: '#1976d2'
  },
  {
    id: 'SN', 
    label: 'Cảm nhận - Trực giác (S/N)',
    description: 'Câu hỏi đánh giá cách thu thập và xử lý thông tin',
    values: ['S', 'N'],
    color: '#388e3c'
  },
  {
    id: 'TF',
    label: 'Lý trí - Cảm xúc (T/F)', 
    description: 'Câu hỏi đánh giá cách đưa ra quyết định',
    values: ['T', 'F'],
    color: '#f57c00'
  },
  {
    id: 'JP',
    label: 'Nguyên tắc - Linh hoạt (J/P)',
    description: 'Câu hỏi đánh giá cách tổ chức cuộc sống',
    values: ['J', 'P'],
    color: '#7b1fa2'
  }
];

interface Option {
  text: string;
  value: string;
}

interface Question {
  _id: string;
  text: string;
  options: Option[];
  isActive: boolean;
  category: string;
}

type QuestionForm = Omit<Question, '_id'>;

const initialFormState: QuestionForm = {
  text: '',
  options: [{ text: '', value: '' }, { text: '', value: '' }],
  isActive: true,
  category: '',
};

// Hàm xác định câu hỏi thuộc xu hướng nào
const getDimensionForQuestion = (question: Question): string => {
  const values = question.options.map(opt => opt.value);
  
  if (values.includes('E') || values.includes('I')) return 'EI';
  if (values.includes('S') || values.includes('N')) return 'SN';
  if (values.includes('T') || values.includes('F')) return 'TF';
  if (values.includes('J') || values.includes('P')) return 'JP';
  
  return 'other';
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dimension-tabpanel-${index}`}
      aria-labelledby={`dimension-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dimension-tab-${index}`,
    'aria-controls': `dimension-tabpanel-${index}`,
  };
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<QuestionForm>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentDimensionId, setCurrentDimensionId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/questions', { credentials: 'include' })
      .then(res => res.json())
      .then((data: Question[]) => setQuestions(data));
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpen = (idx: number | null = null, dimensionId?: string) => {
    setEditIdx(idx);
    
    if (idx === null) {
      // Thêm mới
      setCurrentDimensionId(dimensionId || null);
      // Nếu thêm mới từ tab cụ thể, set default category và options rỗng với 2 giá trị tương ứng
      const newForm = { ...initialFormState };
      if (dimensionId && dimensionId !== 'other') {
        newForm.category = dimensionId;
        // Set 2 options rỗng với giá trị tương ứng xu hướng
        const dimension = DIMENSION_TABS.find(d => d.id === dimensionId);
        if (dimension) {
          newForm.options = [
            { text: '', value: dimension.values[0] },
            { text: '', value: dimension.values[1] }
          ];
        }
      }
      setForm(newForm);
    } else {
      // Sửa câu hỏi hiện có
      const questionToEdit = questions[idx];
      const { text, options, isActive, category } = questionToEdit;
      
      // Xác định dimension của câu hỏi hiện tại để khóa các trường tương ứng
      const questionDimension = getDimensionForQuestion(questionToEdit);
      setCurrentDimensionId(questionDimension);
      
      setForm({ text, options, isActive, category });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChange = (field: keyof QuestionForm, value: string | boolean) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleOptionChange = (idx: number, field: keyof Option, value: string) => {
    setForm(f => {
      const options = [...f.options];
      options[idx] = { ...options[idx], [field]: value };
      return { ...f, options };
    });
  };

  const handleAddOption = () => {
    setForm(f => ({ ...f, options: [...f.options, { text: '', value: '' }] }));
  };

  const handleRemoveOption = (idx: number) => {
    setForm(f => ({ ...f, options: f.options.filter((_, i: number) => i !== idx) }));
  };

  const handleSubmit = async () => {
    if (!form.text || !form.category || form.options.some(o => !o.text || !o.value)) {
      setError('Vui lòng nhập đầy đủ nội dung, nhóm và đáp án!');
      return;
    }
    
    setError(null); // Clear previous errors
    
    const method = editIdx === null ? 'POST' : 'PUT';
    const body = editIdx === null ? form : { ...form, _id: questions[editIdx]._id };

    try {
      const res = await fetch('/api/admin/questions', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        setError(responseData.error || `Có lỗi xảy ra: ${res.status}`);
        return;
      }
      
      if (editIdx === null) {
          setQuestions(q => [...q, responseData]);
      } else {
          setQuestions(q => q.map(item => (item._id === responseData._id ? responseData : item)));
      }
      setOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error submitting question:', error);
      setError('Lỗi kết nối. Vui lòng thử lại!');
    }
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    const res = await fetch('/api/admin/questions', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: questions[idx]._id }),
    });
    if (res.ok) setQuestions(q => q.filter((_, i) => i !== idx));
  };

  // Phân loại câu hỏi theo từng xu hướng
  const getQuestionsByDimension = (dimensionId: string) => {
    if (dimensionId === 'other') {
      return questions.filter(q => getDimensionForQuestion(q) === 'other');
    }
    return questions.filter(q => getDimensionForQuestion(q) === dimensionId);
  };

  const renderQuestionList = (dimensionQuestions: Question[]) => {
    if (dimensionQuestions.length === 0) {
      return (
        <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
          Chưa có câu hỏi nào cho xu hướng này.
        </Typography>
      );
    }

    return (
      <List>
        {dimensionQuestions.map((q) => {
          const originalIdx = questions.findIndex(question => question._id === q._id);
          return (
            <ListItem key={q._id} divider>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {q.text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {q.options.map((opt, i) => (
                        <Chip 
                          key={i}
                          label={`${opt.text} (${opt.value})`}
                          size="small"
                          variant="outlined"
                          color={opt.value === 'E' || opt.value === 'S' || opt.value === 'T' || opt.value === 'J' ? 'primary' : 'secondary'}
                        />
                      ))}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={q.category || 'Chưa phân loại'} 
                      size="small" 
                      color="default"
                    />
                    {!q.isActive && (
                      <Chip 
                        label="Không hoạt động" 
                        size="small" 
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpen(originalIdx)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(originalIdx)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý câu hỏi MBTI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý câu hỏi theo 4 xu hướng tính cách đối lập của MBTI
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
        >
          Thêm câu hỏi mới
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            aria-label="MBTI dimensions tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {DIMENSION_TABS.map((dimension, index) => (
              <Tab 
                key={dimension.id}
                label={
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {dimension.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getQuestionsByDimension(dimension.id).length} câu hỏi
                    </Typography>
                  </Box>
                }
                {...a11yProps(index)}
              />
            ))}
            <Tab 
              label={
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">
                    Câu hỏi khác
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getQuestionsByDimension('other').length} câu hỏi
                  </Typography>
                </Box>
              }
              {...a11yProps(4)}
            />
          </Tabs>
        </Box>

        {DIMENSION_TABS.map((dimension, index) => (
          <TabPanel key={dimension.id} value={selectedTab} index={index}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom color={dimension.color}>
                    {dimension.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dimension.description}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpen(null, dimension.id)}
                  size="small"
                >
                  Thêm câu hỏi {dimension.id}
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Box>
            {renderQuestionList(getQuestionsByDimension(dimension.id))}
          </TabPanel>
        ))}

        <TabPanel value={selectedTab} index={4}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Câu hỏi khác
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Các câu hỏi chưa được phân loại hoặc không thuộc 4 xu hướng chính
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpen(null, 'other')}
                size="small"
              >
                Thêm câu hỏi khác
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Box>
          {renderQuestionList(getQuestionsByDimension('other'))}
        </TabPanel>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIdx === null ? (
            currentDimensionId && currentDimensionId !== 'other' ? (
              <Box>
                <Typography variant="h6">
                  Thêm câu hỏi cho xu hướng {currentDimensionId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {DIMENSION_TABS.find(d => d.id === currentDimensionId)?.label}
                </Typography>
              </Box>
            ) : (
              'Thêm câu hỏi mới'
            )
          ) : (
            'Chỉnh sửa câu hỏi'
          )}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nội dung câu hỏi"
              value={form.text}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('text', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Nhóm (category)"
              value={form.category}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('category', e.target.value)}
              fullWidth
              disabled={!!(currentDimensionId && currentDimensionId !== 'other')}
              helperText={
                currentDimensionId && currentDimensionId !== 'other'
                  ? editIdx === null 
                    ? `Tự động set thành "${currentDimensionId}" cho xu hướng này`
                    : `Câu hỏi thuộc nhóm ${currentDimensionId} - không thể thay đổi`
                  : "Ví dụ: EI, SN, TF, JP hoặc tên nhóm tự định nghĩa"
              }
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Các đáp án:
            </Typography>
            {form.options.map((opt, i) => (
              <Box key={i} display="flex" gap={1} alignItems="center">
                <TextField
                  label={`Đáp án ${i + 1}`}
                  value={opt.text}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange(i, 'text', e.target.value)}
                  fullWidth
                />
                <Autocomplete
                  options={(() => {
                    // Nếu đang thêm từ tab cụ thể, chỉ hiển thị 2 giá trị tương ứng
                    if (currentDimensionId && currentDimensionId !== 'other') {
                      const dimension = DIMENSION_TABS.find(d => d.id === currentDimensionId);
                      if (dimension) {
                        return VALUE_OPTIONS.filter(option => 
                          dimension.values.includes(option.value)
                        );
                      }
                    }
                    return VALUE_OPTIONS;
                  })()}
                  getOptionLabel={(option) => option.label}
                  value={VALUE_OPTIONS.find(o => o.value === opt.value) || null}
                  onChange={(_, v) => handleOptionChange(i, 'value', v ? v.value : '')}
                  renderInput={params => <TextField {...params} label="Xu hướng" />}
                  sx={{ minWidth: 200 }}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  disabled={!!(currentDimensionId && currentDimensionId !== 'other')}
                />
                <IconButton 
                  onClick={() => handleRemoveOption(i)} 
                  disabled={form.options.length <= 2 || !!(currentDimensionId && currentDimensionId !== 'other')}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button 
              onClick={handleAddOption}
              variant="outlined"
              startIcon={<AddIcon />}
              disabled={!!(currentDimensionId && currentDimensionId !== 'other')}
            >
              {currentDimensionId && currentDimensionId !== 'other'
                ? `Câu hỏi ${currentDimensionId} chỉ có 2 đáp án` 
                : 'Thêm đáp án'}
            </Button>
            <Box>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.isActive} 
                  onChange={e => handleChange('isActive', e.target.checked)} 
                />
                <Typography component="span" sx={{ ml: 1 }}>
                  Hiển thị câu hỏi này
                </Typography>
              </label>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIdx === null ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 