'use client';

import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import { mbtiResults } from '@/data/results';

const CareersPage = () => {
  // Tạo một mảng chứa tất cả các nghề nghiệp từ các loại MBTI
  const allCareers = Array.from(
    new Set(
      Object.values(mbtiResults).flatMap((result) => result.careers)
    )
  ).sort();

  // Nhóm các nghề nghiệp theo loại MBTI
  const careersByMBTI = Object.entries(mbtiResults).reduce((acc, [type, result]) => {
    result.careers.forEach((career) => {
      if (!acc[career]) {
        acc[career] = [];
      }
      acc[career].push(type);
    });
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        Danh sách nghề nghiệp tiềm năng năm 2025
      </Typography>

      <Grid container spacing={4}>
        {allCareers.map((career) => (
          <Grid item xs={12} sm={6} md={4} key={career}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {career}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Phù hợp với các loại tính cách:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {careersByMBTI[career].map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CareersPage; 