"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface PersonalityType {
  _id: string;
  type: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

const PersonalityTypesPage = () => {
  const [types, setTypes] = useState<PersonalityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/personality-types");
        if (!res.ok) throw new Error("Không thể tải dữ liệu loại tính cách");
        const data = await res.json();
        setTypes(data);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Danh sách 16 loại tính cách MBTI
      </Typography>
      <Box>
        {types.map((item) => (
          <Accordion key={item.type}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{item.type} - {item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Mô tả:</b> {item.description}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2"><b>Điểm mạnh:</b></Typography>
              <List dense>
                {item.strengths?.map((s, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={s} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2"><b>Điểm yếu:</b></Typography>
              <List dense>
                {item.weaknesses?.map((w, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={w} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2"><b>Nghề nghiệp phù hợp:</b></Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {item.careers?.map((career, idx) => (
                  <Chip key={idx} label={career} color="primary" variant="outlined" />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default PersonalityTypesPage; 