'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Fade,
  Paper,
  Chip,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Question } from '@/core/domain/entities/Question';

interface TestQuestionProps {
  question: Question;
  selectedOption: string | null;
  onOptionSelect: (optionId: string) => void;
}

export const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  selectedOption,
  onOptionSelect,
}) => {
  return (
    <Fade in={true} timeout={500}>
      <Card sx={{ mb: 3, elevation: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 500, flex: 1 }}>
              {question.text}
            </Typography>
            {selectedOption && (
              <Chip
                icon={<CheckCircle />}
                label="Đã trả lời"
                color="success"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Box>
          
          <RadioGroup
            value={selectedOption || ''}
            onChange={(e) => onOptionSelect(e.target.value)}
          >
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              
              return (
                <Paper
                  key={option.id}
                  elevation={isSelected ? 4 : 1}
                  sx={{
                    mb: 1.5,
                    border: 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: isSelected ? 'action.selected' : 'transparent',
                    boxShadow: isSelected ? '0 4px 12px 0 rgba(0,0,0,0.12)' : 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: isSelected ? 'action.selected' : 'action.hover',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: isSelected ? '0 4px 12px 0 rgba(0,0,0,0.12)' : '0 1px 3px 0 rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <FormControlLabel
                    value={option.id}
                    control={
                      <Radio 
                        sx={{ 
                          ml: 0.5,
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', ml: 1 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            flexGrow: 1, 
                            fontWeight: isSelected ? 'bold' : 'normal', 
                            color: isSelected ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {option.text}
                        </Typography>
                        {isSelected && (
                          <CheckCircle
                            color="primary"
                            sx={{ ml: 2, mr: 1 }}
                          />
                        )}
                      </Box>
                    }
                    sx={{ 
                      margin: 0, 
                      width: '100%',
                      p: 2,
                      cursor: 'pointer',
                    }}
                  />
                </Paper>
              );
            })}
          </RadioGroup>
          
          {/* Question metadata */}
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Danh mục: {question.category} • 
              {selectedOption ? ' ✓ Đã trả lời' : ' Hãy chọn đáp án phù hợp nhất với bạn'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default TestQuestion; 