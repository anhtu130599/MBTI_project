import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Button,
  Fade,
} from '@mui/material';
import { Question } from '@/types/mbti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (value: string) => {
    onAnswer(value);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    onNext();
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {question.text}
        </Typography>

        <RadioGroup
          value={selectedAnswer || ''}
          onChange={(e) => handleAnswer(e.target.value)}
        >
          {question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.value}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.text}
                </Box>
              }
              sx={{
                mb: 2,
                p: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-checked': {
                  backgroundColor: 'action.selected',
                },
              }}
            />
          ))}
        </RadioGroup>

        {showFeedback && (
          <Fade in={showFeedback}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={onPrevious}
                disabled={isFirst}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedAnswer}
              >
                {isLast ? 'Hoàn thành' : 'Tiếp tục'}
              </Button>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
} 