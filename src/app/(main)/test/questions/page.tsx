'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { TestQuestion } from '@/features/test/components/TestQuestion';
import { testService } from '@/features/test/services/testService';
import { Question } from '@/core/domain/entities/Question';

export default function TestQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await testService.getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await testService.submitAnswers(answers);
      router.push(`/test/result?type=${result.type}`);
    } catch (error) {
      console.error('Failed to submit answers:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrentQuestion = answers[currentQuestion?.id];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bài kiểm tra MBTI
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph align="center">
        Câu hỏi {currentQuestionIndex + 1} / {questions.length}
      </Typography>

      {currentQuestion && (
        <TestQuestion
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id] || null}
          onOptionSelect={handleOptionSelect}
        />
      )}

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>
        {isLastQuestion ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrentQuestion || submitting}
          >
            {submitting ? 'Đang xử lý...' : 'Hoàn thành'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!hasAnsweredCurrentQuestion}
          >
            Câu tiếp theo
          </Button>
        )}
      </Box>
    </Container>
  );
} 