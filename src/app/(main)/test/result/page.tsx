'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { TestResult } from '@/core/domain/entities/TestResult';

function TestResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      // TODO: Fetch result from API
      // For now, using mock data
      setResult({
        type,
        description: 'Your personality type description will appear here.',
        strengths: ['Strength 1', 'Strength 2', 'Strength 3'],
        weaknesses: ['Weakness 1', 'Weakness 2', 'Weakness 3'],
        careers: [
          {
            title: 'Career 1',
            description: 'Description for career 1',
            matchScore: 90,
          },
          {
            title: 'Career 2',
            description: 'Description for career 2',
            matchScore: 85,
          },
        ],
      });
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading results...</Typography>
        </Box>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" color="error" align="center">
          No results found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your MBTI Result: {result.type}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography paragraph>{result.description}</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Strengths
              </Typography>
              <List>
                {result.strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weaknesses
              </Typography>
              <List>
                {result.weaknesses.map((weakness, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={weakness} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recommended Careers
          </Typography>
          <List>
            {result.careers.map((career, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {career.title}
                        <Chip
                          label={`${career.matchScore}% Match`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={career.description}
                  />
                </ListItem>
                {index < result.careers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function TestResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestResultContent />
    </Suspense>
  );
} 