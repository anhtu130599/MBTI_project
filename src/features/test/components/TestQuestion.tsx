'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Fade,
  Paper,
  Chip,
} from '@mui/material';
import { CheckCircle, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
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
            {question.options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              
              return (
                <Paper
                  key={option.id}
                  elevation={isSelected ? 3 : 0}
                  sx={{
                    mb: 2,
                    border: 2,
                    borderColor: isSelected ? 'success.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: isSelected ? 'success.50' : 'transparent',
                    '&:hover': {
                      borderColor: isSelected ? 'success.main' : 'primary.light',
                      backgroundColor: isSelected ? 'success.50' : 'action.hover',
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <FormControlLabel
                    value={option.id}
                    control={
                      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Radio 
                          icon={
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              border: 2, 
                              borderColor: 'divider', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease-in-out'
                            }}>
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                transition: 'all 0.2s ease-in-out'
                              }} />
                            </Box>
                          }
                          checkedIcon={
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              border: 2, 
                              borderColor: 'success.main', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'success.light',
                              boxShadow: '0 0 0 4px rgba(76, 175, 80, 0.12)'
                            }}>
                              <Box sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%',
                                backgroundColor: 'success.main',
                                boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
                              }} />
                            </Box>
                          }
                          sx={{ 
                            ml: 1,
                            '&.Mui-checked': {
                              color: 'success.main',
                            }
                          }} 
                        />
                        {isSelected && (
                          <CheckCircle 
                            sx={{ 
                              position: 'absolute',
                              right: -8,
                              top: -8,
                              color: 'success.main',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              zIndex: 1
                            }} 
                          />
                        )}
                      </Box>
                    }
                    label={
                      <Box sx={{ py: 1, pr: 2, display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? 'success.dark' : 'text.primary',
                              mb: 0.5
                            }}
                          >
                            {option.text}
                          </Typography>
                          {/* Option letter indicator */}
                          <Chip
                            label={String.fromCharCode(65 + index)} // A, B, C, D...
                            size="small"
                            variant={isSelected ? "filled" : "outlined"}
                            color={isSelected ? "success" : "default"}
                            sx={{ 
                              fontSize: '0.75rem',
                              height: 20,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        </Box>
                        {isSelected && (
                          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'success.main',
                                fontWeight: 600,
                                mr: 1
                              }}
                            >
                              ✓ Đã chọn
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                    sx={{
                      m: 0,
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: 2,
                      '& .MuiFormControlLabel-label': {
                        flex: 1,
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
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