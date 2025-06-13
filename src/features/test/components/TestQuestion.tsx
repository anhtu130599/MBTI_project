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
} from '@mui/material';
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
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {question.text}
        </Typography>
        <RadioGroup
          value={selectedOption}
          onChange={(e) => onOptionSelect(e.target.value)}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
              sx={{
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                },
              }}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TestQuestion; 