'use client';

import React, { useEffect, useState } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
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
import { useRouter } from 'next/navigation';

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

interface Option {
  text: string;
  value: string;
}
interface Question {
  _id: string;
  id?: string;
  category: "EI" | "SN" | "TF" | "JP";
  text: string;
  options: Option[];
  order: number;
}

export default function TestPage() {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [testState, setTestState] = useState<TestState>({
    currentQuestion: 0,
    answers: {},
    completed: false,
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [lastResult, setLastResult] = useState<any>(null);
  const [loadingLastResult, setLoadingLastResult] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careers, setCareers] = useState<any[]>([]);
  const router = useRouter();
  let userId: string | undefined = undefined;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('mbti_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user.id;
    }
  }

  const handleStart = () => {
    setShowIntroduction(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = {
      ...testState.answers,
      [questions[testState.currentQuestion]._id]: value,
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
      const result = calculateMBTIResult(testState.answers, questions);
      // Lọc nghề nghiệp phù hợp từ database
      const recommendedCareers = careers
        .filter(career => career.personalityTypes && career.personalityTypes.includes(result))
        .map(career => career.title);
      setTestState({
        ...testState,
        completed: true,
        result: {
          ...mbtiResults[result],
          careers: recommendedCareers,
        },
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
      .every((q) => testState.answers[q._id]);

    if (canNavigate) {
      setTestState({
        ...testState,
        currentQuestion: index,
      });
    }
  };

  useEffect(() => {
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      setLastResult(null);
      setLoadingLastResult(false);
      return;
    }
    async function fetchLastResult() {
      setLoadingLastResult(true);
      try {
        const res = await fetch('/api/test/last', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setLastResult(data);
        } else {
          setLastResult(null);
        }
      } catch {
        setLastResult(null);
      }
      setLoadingLastResult(false);
    }
    fetchLastResult();
  }, [user]);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải câu hỏi');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/careers')
      .then(res => res.json())
      .then(data => setCareers(data));
  }, []);

  if (showIntroduction) {
    // Tính số lượng câu hỏi động
    const totalQuestions = questions.length;
    // Tính thời gian dự kiến: 1-1.5 phút/câu
    let duration = '';
    if (totalQuestions > 0) {
      const min = Math.ceil(totalQuestions * 1);
      const max = Math.ceil(totalQuestions * 1.5);
      duration = min === max ? `${min} phút` : `${min}-${max} phút`;
    } else {
      duration = testConfig.introduction.duration;
    }
    // Truyền props động vào TestIntroduction
    return (
      <TestIntroduction
        config={{
          ...testConfig,
          introduction: {
            ...testConfig.introduction,
            totalQuestions,
            duration,
          },
        }}
        onStart={handleStart}
      />
    );
  }

  const progress = ((testState.currentQuestion + 1) / questions.length) * 100;
  const currentQuestion = questions[testState.currentQuestion];
  const currentGroup = currentQuestion && currentQuestion.category
    ? testConfig.groups.find(group => group.category === currentQuestion.category)
    : undefined;

  if (testState.completed && testState.result) {
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
      if (!testState.result) return;
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
      if (!testState.result) return;
      try {
        const response = await fetch('/api/test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            personalityType: testState.result.type
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSaveMessage('Đã lưu kết quả thành công!');
        } else {
          setSaveMessage(data.error || 'Lưu kết quả thất bại!');
        }
      } catch (error) {
        setSaveMessage('Lỗi khi lưu kết quả!');
      }
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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (currentQuestion && !currentQuestion.category) {
    <Alert severity="warning" sx={{ mb: 2 }}>
      Câu hỏi này chưa có nhóm (category). Vui lòng cập nhật lại dữ liệu câu hỏi!
    </Alert>
  }

  if (!currentQuestion) {
    return <Alert severity="warning">Không có câu hỏi nào trong hệ thống. Vui lòng thêm câu hỏi ở trang quản trị viên!</Alert>;
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
            selectedAnswer={testState.answers[currentQuestion._id]}
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
                  .every((q) => testState.answers[q._id]);
                
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
                      {testState.answers[question._id] ? (
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