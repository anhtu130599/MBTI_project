'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Paper, Box, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { PersonalityType } from '@/core/domain/entities';

async function getPersonalityType(typeId: string): Promise<PersonalityType | null> {
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
  
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
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
        <Typography variant="h5" color="text.secondary" gutterBottom>
          &ldquo;{personalityType.description}&rdquo;
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
                            <ListItemText primary={strength} />
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
                            <ListItemText primary={weakness} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
            <Typography variant="h5" gutterBottom>Sự nghiệp phù hợp</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {personalityType.career_paths.map((career, index) => (
                    <Chip key={index} label={career} color="primary" variant="outlined" />
                ))}
            </Box>
        </Box>

      </Paper>
    </Container>
  );
} 