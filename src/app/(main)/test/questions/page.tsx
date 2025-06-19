'use client';

import React, { useState, useEffect, useRef, createRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  NavigateNext,
  NavigateBefore,
  Send,
  Quiz,
  Lock,
} from '@mui/icons-material';
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

  // Ref for scrolling
  const mainContentRef = useRef<HTMLDivElement>(null);
  const questionListRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  
  // Initialize refs array
  if (questionRefs.current.length !== questions.length) {
    questionRefs.current = Array(questions.length)
      .fill(null)
      .map((_, i) => questionRefs.current[i] || createRef<HTMLLIElement>());
  }

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

  useEffect(() => {
    // Scroll main content to top & sidebar to current question
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      questionRefs.current[currentQuestionIndex]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 300); // Add a small delay to prevent scroll conflicts
  }, [currentQuestionIndex]);

  const handleOptionSelect = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // ENHANCED DEBUG LOG
    // Handle option selection
    // Update answers with selected option
    
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    
    // Apply new answers
    
    setAnswers(newAnswers);
    
    // Verify update after a short delay
    setTimeout(() => {
      console.log('🎯 Answers state after setState (delayed check):', answers);
    }, 100);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const hasAnswered = answers[currentQuestion.id];
    
    if (!hasAnswered) {
      alert('Vui lòng trả lời câu hỏi hiện tại trước khi tiếp tục!');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Logic tuần tự chặt chẽ: chỉ cho phép truy cập câu hỏi nếu:
  // 1. Là câu hỏi đầu tiên (index 0)  
  // 2. Đã trả lời câu hỏi đó rồi (cho phép quay lại)
  // 3. Đã trả lời tất cả câu trước đó (câu tiếp theo trong chuỗi)
  const canNavigateToQuestion = (targetIndex: number) => {
    // Câu hỏi đầu tiên luôn được phép truy cập
    if (targetIndex === 0) {
      return true;
    }
    
    // Luôn cho phép quay lại câu đã trả lời
    const isTargetAnswered = Boolean(answers[questions[targetIndex]?.id]);
    if (isTargetAnswered) {
      return true;
    }
    
    // Kiểm tra xem có phải câu tiếp theo trong chuỗi tuần tự không
    // Nghĩa là tất cả câu từ 0 đến targetIndex-1 đều đã được trả lời
    for (let i = 0; i < targetIndex; i++) {
      const questionId = questions[i]?.id;
      if (!answers[questionId]) {
        return false; // Có câu trước chưa trả lời
      }
    }
    
    return true; // Tất cả câu trước đã trả lời
  };

  const goToQuestion = (index: number) => {
    if (canNavigateToQuestion(index)) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra xem đã trả lời hết tất cả câu hỏi chưa
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions.length > 0) {
      alert(`Vui lòng trả lời tất cả câu hỏi! Còn ${unansweredQuestions.length} câu chưa trả lời.`);
      // Chuyển đến câu hỏi đầu tiên chưa trả lời
      const firstUnansweredIndex = questions.findIndex(q => !answers[q.id]);
      if (firstUnansweredIndex !== -1) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setSubmitting(true);
    try {
      const result = await testService.submitAnswers(answers);
      router.push(`/test/result?type=${result.personalityType || result.type}`);
    } catch (error) {
      console.error('Failed to submit answers:', error);
      alert('Có lỗi xảy ra khi gửi bài làm. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrentQuestion = answers[currentQuestion?.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8} ref={mainContentRef}>
          <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Bài kiểm tra MBTI
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph align="center">
              Câu hỏi {currentQuestionIndex + 1} / {questions.length}
            </Typography>
            
            {/* Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Tiến độ: {answeredCount}/{questions.length} câu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }} 
              />
            </Box>

            {/* Sequential Progress Indicator */}
            <Alert 
              severity="info"
              sx={{ mb: 3 }}
            >
              <Typography variant="body2">
                Bạn đang làm câu {currentQuestionIndex + 1}. Hãy trả lời tuần tự từng câu để tiếp tục.
              </Typography>
            </Alert>

            {/* Current Question */}
            {currentQuestion && (
              <TestQuestion
                question={currentQuestion}
                selectedOption={answers[currentQuestion.id] || null}
                onOptionSelect={handleOptionSelect}
              />
            )}

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                startIcon={<NavigateBefore />}
              >
                Câu trước
              </Button>
              
              {isLastQuestion ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount < questions.length}
                  startIcon={<Send />}
                  color="success"
                  size="large"
                >
                  {submitting ? 'Đang xử lý...' : 'Hoàn thành bài test'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<NavigateNext />}
                  disabled={!hasAnsweredCurrentQuestion}
                >
                  Câu tiếp theo
                </Button>
              )}
            </Box>

            {/* Helpful message */}
            {!hasAnsweredCurrentQuestion && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Vui lòng chọn một đáp án để tiếp tục câu hỏi tiếp theo.
              </Alert>
            )}
          </Box>
        </Grid>

        {/* Sidebar - Question Progress */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Quiz sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Tiến độ bài làm
                </Typography>
              </Box>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Chip 
                    label={`${answeredCount} đã làm`} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    label={`${questions.length - answeredCount} chưa làm`} 
                    color="default" 
                    size="small" 
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ height: 6, borderRadius: 3 }} 
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Question List */}
              <Box ref={questionListRef} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Danh sách câu hỏi:
                </Typography>
                <List dense>
                  {questions.map((question, index) => {
                    if (!question || !question.id) return null;
                    
                    // Kiểm tra chính xác xem câu hỏi có được trả lời chưa
                    const isAnswered = Boolean(answers[question.id]);
                    const isCurrent = index === currentQuestionIndex;
                    
                    // Logic access: chỉ cho phép truy cập nếu:
                    // 1. Là câu đầu tiên (index 0)
                    // 2. Đã trả lời câu này rồi
                    // 3. Tất cả câu trước đó đã được trả lời
                    let isAccessible = false;
                    if (index === 0) {
                      isAccessible = true; // Câu đầu luôn truy cập được
                    } else if (isAnswered) {
                      isAccessible = true; // Câu đã trả lời luôn truy cập được
                    } else {
                      // Kiểm tra tất cả câu trước có được trả lời không
                      let allPreviousAnswered = true;
                      for (let i = 0; i < index; i++) {
                        const prevQuestionId = questions[i]?.id;
                        if (!answers[prevQuestionId]) {
                          allPreviousAnswered = false;
                          break;
                        }
                      }
                      isAccessible = allPreviousAnswered;
                    }
                    
                    const isLocked = !isAccessible;
                    
                    return (
                      <ListItem key={question.id} disablePadding ref={questionRefs.current[index]}>
                        <ListItemButton
                          onClick={() => goToQuestion(index)}
                          selected={isCurrent}
                          disabled={isLocked}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            backgroundColor: isCurrent ? 'action.selected' : 'transparent',
                            opacity: isLocked ? 0.5 : 1,
                            '&:hover': {
                              backgroundColor: isLocked ? 'transparent' : 'action.hover',
                            },
                            '&.Mui-disabled': {
                              opacity: 0.5,
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {isLocked ? (
                              <Lock color="disabled" fontSize="small" />
                            ) : isAnswered ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : (
                              <RadioButtonUnchecked 
                                color={isCurrent ? "primary" : "disabled"} 
                                fontSize="small" 
                              />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Câu ${index + 1}`}
                            secondary={
                              question.text.length > 30 
                                ? `${question.text.substring(0, 30)}...` 
                                : question.text
                            }
                            primaryTypographyProps={{
                              fontWeight: isCurrent ? 'bold' : 'normal',
                              color: isLocked ? 'text.disabled' : isCurrent ? 'primary' : 'inherit'
                            }}
                            secondaryTypographyProps={{
                              fontSize: '0.75rem',
                              color: isLocked ? 'text.disabled' : 'text.secondary'
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>

              {/* Summary */}
              <Divider sx={{ my: 2 }} />
              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  <strong>Lưu ý:</strong> Bạn cần trả lời tuần tự từng câu. Các câu chưa tới lượt sẽ bị khóa.
                </Typography>
              </Paper>

              {/* Completion Status */}
              {answeredCount === questions.length && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    🎉 Hoàn thành! Bạn có thể bấm &quot;Hoàn thành bài test&quot; để xem kết quả.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 