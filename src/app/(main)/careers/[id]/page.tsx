'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface Career {
  _id: string;
  title: string;
  description: string;
  personalityTypes: string[];
  skills: string[];
  salary: string;
  education: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  growth: string;
}

export default function CareerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCareer();
  }, [params.id]);

  const fetchCareer = async () => {
    try {
      const res = await fetch(`/api/careers/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch career details');
      const data = await res.json();
      setCareer(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !career) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Career not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 4 }}
      >
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {career.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {career.description}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tính cách phù hợp
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {career.personalityTypes.map((type, index) => (
                  <Chip
                    key={index}
                    label={type}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kỹ năng cần thiết
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {career.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mức lương: {career.salary}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yêu cầu học vấn: {career.education}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trách nhiệm chính
              </Typography>
              <ul>
                {career.responsibilities.map((item, index) => (
                  <li key={index}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Yêu cầu
              </Typography>
              <ul>
                {career.requirements.map((item, index) => (
                  <li key={index}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quyền lợi
              </Typography>
              <ul>
                {career.benefits.map((item, index) => (
                  <li key={index}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Cơ hội phát triển
              </Typography>
              <Typography variant="body2">{career.growth}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 