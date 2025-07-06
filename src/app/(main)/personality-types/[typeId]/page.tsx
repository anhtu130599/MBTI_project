'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Paper, Box, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { useParams } from 'next/navigation';

interface PersonalityDetailInfo {
  _id: string;
  type: string;
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
  development_advice: string[];
  career_guidance: {
    suitable_fields: string[];
    improvement_skills: string[];
    career_matches: string[];
  };
}



async function getPersonalityType(typeId: string): Promise<PersonalityDetailInfo | null> {
  try {
    const res = await fetch(`/api/personality-types/${typeId}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch personality type:', error);
    return null;
  }
}

export default function PersonalityTypeDetailPage() {
  const params = useParams();
  const typeId = params.typeId as string;
  
  const [personalityType, setPersonalityType] = useState<PersonalityDetailInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!typeId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const data = await getPersonalityType(typeId.toUpperCase());
      if (data) {
        setPersonalityType(data);
      } else {
        setError(`Không tìm thấy thông tin cho loại tính cách: ${typeId}`);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [typeId]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!personalityType) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {typeId}: {personalityType.name}
        </Typography>
        
        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom>Mô tả chi tiết</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {personalityType.description}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Điểm mạnh</Typography>
                <List>
                    {personalityType.strengths.map((strength, index) => (
                        <ListItem key={index}>
                            <ListItemIcon><CheckCircleOutline color="success" /></ListItemIcon>
                            <ListItemText 
                              primary={strength.title} 
                              secondary={strength.description}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Điểm yếu</Typography>
                <List>
                    {personalityType.weaknesses.map((weakness, index) => (
                        <ListItem key={index}>
                            <ListItemIcon><HighlightOff color="error" /></ListItemIcon>
                            <ListItemText 
                              primary={weakness.title} 
                              secondary={weakness.description}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
            <Typography variant="h5" gutterBottom>Lời khuyên phát triển</Typography>
            <List>
                {personalityType.development_advice.map((advice, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={advice} />
                    </ListItem>
                ))}
            </List>
        </Box>

        <Divider sx={{ my: 4 }} />
        
        <Box>
            <Typography variant="h5" gutterBottom>Hướng nghiệp</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Lĩnh vực phù hợp</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {personalityType.career_guidance.suitable_fields.map((field, index) => (
                            <Chip
                                key={index}
                                label={field}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Kỹ năng cần cải thiện</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {personalityType.career_guidance.improvement_skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                color="secondary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Nghề nghiệp phù hợp</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {personalityType.career_guidance.career_matches.map((career, index) => (
                            <Chip
                                key={index}
                                label={career}
                                color="success"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>

      </Paper>
    </Container>
  );
} 