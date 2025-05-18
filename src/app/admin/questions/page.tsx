'use client';
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, List, ListItem, ListItemText, ListItemSecondaryAction, Alert, Stack
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

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<any>({ text: '', options: [{ text: '', value: '' }, { text: '', value: '' }], isActive: true, category: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/questions', { credentials: 'include' })
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const handleOpen = (idx: number | null = null) => {
    setEditIdx(idx);
    if (idx === null) {
      setForm({ text: '', options: [{ text: '', value: '' }, { text: '', value: '' }], isActive: true, category: '' });
    } else {
      setForm(questions[idx]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };

  const handleOptionChange = (idx: number, field: string, value: any) => {
    setForm((f: any) => {
      const options = [...f.options];
      options[idx] = { ...options[idx], [field]: value };
      return { ...f, options };
    });
  };

  const handleAddOption = () => {
    setForm((f: any) => ({ ...f, options: [...f.options, { text: '', value: '' }] }));
  };

  const handleRemoveOption = (idx: number) => {
    setForm((f: any) => ({ ...f, options: f.options.filter((_: any, i: number) => i !== idx) }));
  };

  const handleSubmit = async () => {
    if (!form.text || !form.category || form.options.some((o: any) => !o.text || !o.value)) {
      setError('Vui lòng nhập đầy đủ nội dung, nhóm và đáp án!');
      return;
    }
    const method = editIdx === null ? 'POST' : 'PUT';
    const res = await fetch('/api/admin/questions', {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError('Có lỗi xảy ra!');
      return;
    }
    const data = await res.json();
    if (editIdx === null) {
      if (questions.length === 0) {
        fetch('/api/admin/questions', { credentials: 'include' })
          .then(res => res.json())
          .then(setQuestions);
      } else {
        setQuestions((q) => [...q, data]);
      }
    } else setQuestions((q) => q.map((item, i) => (i === editIdx ? data : item)));
    setOpen(false);
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    const res = await fetch('/api/admin/questions', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: questions[idx]._id }),
    });
    if (res.ok) setQuestions((q) => q.filter((_, i) => i !== idx));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý câu hỏi MBTI</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
        Thêm câu hỏi
      </Button>
      {questions.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ my: 2 }}>
          Chưa có câu hỏi nào.
        </Typography>
      )}
      <List>
        {questions.map((q, idx) => (
          <ListItem key={q._id} divider>
            <ListItemText
              primary={q.text}
              secondary={q.options.map((o: any) => `${o.text} (${o.value})`).join(' | ')}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(idx)}><EditIcon /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIdx === null ? 'Thêm câu hỏi' : 'Chỉnh sửa câu hỏi'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nội dung câu hỏi"
              value={form.text}
              onChange={e => handleChange('text', e.target.value)}
              fullWidth
              multiline
            />
            <TextField
              label="Nhóm (category)"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              fullWidth
            />
            {form.options.map((opt: any, i: number) => (
              <Box key={i} display="flex" gap={1} alignItems="center">
                <TextField
                  label={`Đáp án ${i + 1}`}
                  value={opt.text}
                  onChange={e => handleOptionChange(i, 'text', e.target.value)}
                  fullWidth
                />
                <Autocomplete
                  options={VALUE_OPTIONS}
                  getOptionLabel={o => o.label}
                  value={VALUE_OPTIONS.find(o => o.value === opt.value) || null}
                  onChange={(_, v) => handleOptionChange(i, 'value', v ? v.value : '')}
                  renderInput={params => <TextField {...params} label="Loại" />}
                  sx={{ minWidth: 180 }}
                  isOptionEqualToValue={(o, v) => o.value === v.value}
                  disableClearable
                  freeSolo
                />
                <IconButton onClick={() => handleRemoveOption(i)} disabled={form.options.length <= 2}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button onClick={handleAddOption}>Thêm đáp án</Button>
            <Box>
              <label>
                <input type="checkbox" checked={form.isActive} onChange={e => handleChange('isActive', e.target.checked)} />
                Hiển thị câu hỏi này
              </label>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 