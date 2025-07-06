"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from 'next/navigation';

interface PersonalityType {
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
}

interface Career {
  id: string;
  title: string;
}

interface CareerResponse {
  data?: {
    careers?: Array<{ _id?: string; id?: string; title: string }>;
  };
}

const PersonalityTypesPage = () => {
  const router = useRouter();
  const [types, setTypes] = useState<PersonalityType[]>([]);
  const [careersMap, setCareersMap] = useState<Record<string, Career[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/personality-types");
        if (!res.ok) throw new Error("Không thể tải dữ liệu loại tính cách");
        const data = await res.json();
        setTypes(data);
        // Fetch careers for all types in parallel
        const careersResults = await Promise.all(
          data.map(async (type: PersonalityType) => {
            try {
              const res = await fetch(`/api/careers/personality/${type.type}`);
              if (!res.ok) return { type: type.type, careers: [] };
              const careerData: CareerResponse = await res.json();
              return {
                type: type.type,
                careers: (careerData.data?.careers || []).map((c) => ({ 
                  id: c._id || c.id || '', 
                  title: c.title 
                }))
              };
            } catch {
              return { type: type.type, careers: [] };
            }
          })
        );
        const map: Record<string, Career[]> = {};
        careersResults.forEach(r => { map[r.type] = r.careers; });
        setCareersMap(map);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Lỗi không xác định");
        } else {
          setError("Lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleTypeClick = (type: string) => {
    router.push(`/personality-types/${type}`);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Các loại tính cách MBTI
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Khám phá 16 loại tính cách MBTI và tìm hiểu về đặc điểm, điểm mạnh, điểm yếu của mỗi loại
      </Typography>

      <Grid container spacing={3}>
        {types.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleTypeClick(type.type)}
            >
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {type.type} - {type.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {type.description.length > 200 ? `${type.description.substring(0, 200)}...` : type.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Đặc điểm nổi bật:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {type.strengths.slice(0, 3).map((strength, strengthIndex) => (
                      <Chip
                        key={strengthIndex}
                        label={strength.title}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {type.strengths.length > 3 && (
                      <Chip
                        label={`+${type.strengths.length - 3} more`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nghề nghiệp phù hợp:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(careersMap[type.type] || []).slice(0, 3).map((career, careerIndex) => (
                      <Chip
                        key={career.id || careerIndex}
                        label={career.title}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                    {(careersMap[type.type]?.length || 0) > 3 && (
                      <Chip
                        label={`+${careersMap[type.type].length - 3} more`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
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

export default PersonalityTypesPage; 