'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { questions } from '@/data/questions';
import { TestState } from '@/types/mbti';
import { calculateMBTIResult } from '@/utils/mbtiCalculator';
import { mbtiResults } from '@/data/results';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TestIntroduction from '@/components/test/TestIntroduction';
import QuestionGroupInfo from '@/components/test/QuestionGroupInfo';
import QuestionCard from '@/components/test/QuestionCard';
import { testConfig } from '@/data/testConfig';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import ShareIcon from '@mui/icons-material/Share';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import GavelIcon from '@mui/icons-material/Gavel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import MBTIDetailAccordion from '@/components/test/MBTIDetailAccordion';
import { mbtiDescriptions } from '@/data/mbtiDescriptions';

const mbtiIcons: Record<string, JSX.Element> = {
  ENTJ: <SupervisorAccountIcon sx={{ fontSize: 64, color: '#1976d2' }} />,
  INTJ: <PsychologyIcon sx={{ fontSize: 64, color: '#512da8' }} />,
  INFP: <EmojiNatureIcon sx={{ fontSize: 64, color: '#43a047' }} />,
  ENFP: <EmojiEmotionsIcon sx={{ fontSize: 64, color: '#fbc02d' }} />,
  ISTJ: <GavelIcon sx={{ fontSize: 64, color: '#6d4c41' }} />,
  INTP: <LightbulbIcon sx={{ fontSize: 64, color: '#0288d1' }} />,
  ENFJ: <GroupIcon sx={{ fontSize: 64, color: '#c62828' }} />,
  ENTP: <StarIcon sx={{ fontSize: 64, color: '#fbc02d' }} />,
  // Các nhóm còn lại có thể dùng lại icon hoặc chọn thêm sau
};

export default function TestPage() {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [testState, setTestState] = useState<TestState>({
    currentQuestion: 0,
    answers: {},
    completed: false,
  });

  const handleStart = () => {
    setShowIntroduction(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  if (showIntroduction) {
    return <TestIntroduction config={testConfig} onStart={handleStart} />;
  }

  const progress = ((testState.currentQuestion + 1) / questions.length) * 100;
  const currentQuestion = questions[testState.currentQuestion];
  const currentGroup = testConfig.groups.find(group => group.category === currentQuestion.category);

  if (testState.completed && testState.result) {
    // TODO: Lấy userId từ hệ thống user thực tế khi phát triển (hiện tại luôn là undefined)
    const userId = undefined;
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const handleRestart = () => {
      setTestState({
        currentQuestion: 0,
        answers: {},
        completed: false,
      });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleShare = () => {
      const shareText = `Kết quả MBTI của tôi là ${testState.result.type}: ${testState.result.description}`;
      if (navigator.share) {
        navigator.share({
          title: 'Kết quả MBTI',
          text: shareText,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        alert('Đã sao chép kết quả vào clipboard!');
      }
    };

    const handleSaveResult = async () => {
      if (!userId) {
        setSaveMessage('Bạn cần đăng nhập để lưu kết quả!');
        return;
      }
      // TODO: Gọi API lưu kết quả với userId khi đã có hệ thống user
      // await saveTestResult({ userId, ... });
      setSaveMessage('Đã lưu kết quả thành công!');
    };

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ mb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {mbtiIcons[testState.result.type]}
            <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
              {testState.result.type}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {testState.result.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReplayIcon />}
              onClick={handleRestart}
            >
              Làm lại bài test
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Chia sẻ kết quả
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveResult}
            >
              Lưu kết quả
            </Button>
          </Box>
          {saveMessage && (
            <Typography color={saveMessage.includes('đăng nhập') ? 'error' : 'success.main'} sx={{ mb: 2 }}>
              {saveMessage}
            </Typography>
          )}
          <Card sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
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
          <Card sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
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
          <Card sx={{ width: '100%', maxWidth: 600 }}>
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
          {mbtiDescriptions[testState.result.type] && (
            <MBTIDetailAccordion detail={mbtiDescriptions[testState.result.type]} />
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4, display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">
              Đã trả lời: {Object.keys(testState.answers).length}/{questions.length} câu
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Câu hiện tại: {testState.currentQuestion + 1}/{questions.length}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />
          
          {currentGroup && (
            <QuestionGroupInfo
              group={currentGroup}
              currentQuestionIndex={currentGroup.questions.findIndex(q => q.id === currentQuestion.id)}
              totalQuestions={currentGroup.questions.length}
            />
          )}

          <QuestionCard
            question={currentQuestion}
            selectedAnswer={testState.answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={testState.currentQuestion === 0}
            isLast={testState.currentQuestion === questions.length - 1}
          />
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