'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { questions } from '@/data/questions';
import { TestState } from '@/types/mbti';
import { calculateMBTIResult } from '@/utils/mbtiCalculator';
import { mbtiResults } from '@/data/results';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TestPage() {
  const [testState, setTestState] = useState<TestState>({
    currentQuestion: 0,
    answers: {},
    completed: false,
  });

  const handleAnswer = (value: string) => {
    const newAnswers = {
      ...testState.answers,
      [questions[testState.currentQuestion].id]: value,
    };

    setTestState({
      ...testState,
      answers: newAnswers,
    });
  };

  const handleNext = () => {
    if (testState.currentQuestion < questions.length - 1) {
      setTestState({
        ...testState,
        currentQuestion: testState.currentQuestion + 1,
      });
    } else {
      const result = calculateMBTIResult(testState.answers);
      setTestState({
        ...testState,
        completed: true,
        result: mbtiResults[result],
      });
    }
  };

  const handlePrevious = () => {
    if (testState.currentQuestion > 0) {
      setTestState({
        ...testState,
        currentQuestion: testState.currentQuestion - 1,
      });
    }
  };

  const handleQuestionClick = (index: number) => {
    // Kiểm tra xem tất cả các câu hỏi trước đó đã được trả lời chưa
    const canNavigate = questions
      .slice(0, index)
      .every((q) => testState.answers[q.id]);

    if (canNavigate) {
      setTestState({
        ...testState,
        currentQuestion: index,
      });
    }
  };

  const progress = ((testState.currentQuestion + 1) / questions.length) * 100;

  if (testState.completed && testState.result) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" gutterBottom>
            Kết quả MBTI của bạn
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {testState.result.type}
          </Typography>
          <Typography variant="body1" paragraph>
            {testState.result.description}
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Điểm mạnh
              </Typography>
              <ul>
                {testState.result.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Điểm yếu
              </Typography>
              <ul>
                {testState.result.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nghề nghiệp phù hợp
              </Typography>
              <ul>
                {testState.result.careers.map((career, index) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4, display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />
          <Typography variant="h6" gutterBottom>
            Câu hỏi {testState.currentQuestion + 1}/{questions.length}
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {questions[testState.currentQuestion].text}
              </Typography>
              <RadioGroup
                value={testState.answers[questions[testState.currentQuestion].id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              >
                {questions[testState.currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handlePrevious}
              disabled={testState.currentQuestion === 0}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!testState.answers[questions[testState.currentQuestion].id]}
            >
              {testState.currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            width: 200,
            height: 'fit-content',
            position: 'sticky',
            top: 20,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Danh sách câu hỏi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {questions.map((question, index) => {
                const canNavigate = questions
                  .slice(0, index)
                  .every((q) => testState.answers[q.id]);
                
                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleQuestionClick(index)}
                      selected={testState.currentQuestion === index}
                      disabled={!canNavigate}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      <ListItemText
                        primary={`Câu ${index + 1}`}
                        primaryTypographyProps={{
                          align: 'center',
                        }}
                      />
                      {testState.answers[question.id] ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon color="disabled" />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 