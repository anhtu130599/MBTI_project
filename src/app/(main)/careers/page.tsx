'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Career {
  _id: string;
  title: string;
  description: string;
  personalityTypes: string[];
  skills: string[];
  education?: string;
  salary?: string;
}

const CareersPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch('/api/careers');
        if (!res.ok) throw new Error('Không thể tải danh sách nghề nghiệp');
        const data = await res.json();
        setCareers(data);
      } catch {
        setError('Lỗi khi tải danh sách nghề nghiệp');
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  // Nhóm các nghề nghiệp theo tên, tổng hợp personalityTypes
  const groupedCareers = careers.reduce((acc, career) => {
    if (!acc[career.title]) {
      acc[career.title] = { ...career, personalityTypes: [...career.personalityTypes] };
    } else {
      acc[career.title].personalityTypes = Array.from(new Set([...acc[career.title].personalityTypes, ...career.personalityTypes]));
    }
    return acc;
  }, {} as Record<string, Career>);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        Danh sách nghề nghiệp năm {year}
      </Typography>
      <Grid container spacing={2}>
        {Object.values(groupedCareers).map((career) => (
          <Grid item xs={12} key={career._id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{career.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {career.description && (
                  <Typography variant="body1" sx={{ mb: 1 }}>{career.description}</Typography>
                )}
                {career.salary && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <b>Mức lương tham khảo:</b> {career.salary}
                  </Typography>
                )}
                {career.skills && career.skills.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary"><b>Kỹ năng cần thiết:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {career.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                {career.personalityTypes && career.personalityTypes.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary"><b>Phù hợp với các loại tính cách:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {career.personalityTypes.map((type) => (
                        <Chip key={type} label={type} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                {career.education && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <b>Yêu cầu học vấn:</b> {career.education}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CareersPage; 