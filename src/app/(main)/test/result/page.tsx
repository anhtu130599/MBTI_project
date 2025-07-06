'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  CheckCircleOutline,
  HighlightOff,
  Psychology,
  Work,
  TrendingUp,
  School,
  Save,
} from '@mui/icons-material';
import { PersonalityDetailInfo } from '@/core/domain/entities/MBTIDimensionInfo';
import { getCareerGuidance } from '@/shared/data/careerGuidanceData';

interface ExtendedPersonalityInfo extends PersonalityDetailInfo {
  available_careers: Array<{
    id: string;
    title: string;
    description: string;
    industry: string;
    salaryRange: {
      min: number;
      max: number;
      currency: string;
    };
    requiredSkills: string[];
    educationLevel: string;
    experienceLevel: string;
    workEnvironment: string;
    location: string;
    jobOutlook: string;
  }>;
  actual_percentages?: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  actual_scores?: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  total_questions?: number;
  isLoggedIn?: boolean;
}

interface TestResultData {
  personality: {
    type: string;
    name: string;
    description: string;
    strengths: Array<{
      title: string;
      description: string;
      why_explanation: string;
    }>;
    weaknesses: Array<{
      title: string;
      description: string;
      why_explanation: string;
      improvement_advice: string;
    }>;
    development_advice: string[];
    career_guidance: {
      suitable_fields: string[];
      improvement_skills: string[];
      career_matches: string[];
    };
  };
  careers: Array<{
    _id: string;
    title: string;
    description: string;
    industry: string;
  }>;
}

function TestResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ExtendedPersonalityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const fromHistory = searchParams.get('fromHistory') === '1';

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      fetchPersonalityResult(type);
    }
    
    // Kiểm tra và đảm bảo trạng thái wasGuestUser được set đúng
    const wasGuestUser = sessionStorage.getItem('wasGuestUser');
    if (wasGuestUser === null) {
      // Nếu chưa có trạng thái, kiểm tra auth status hiện tại
      checkAuthStatus().then(() => {
        const isCurrentlyLoggedIn = sessionStorage.getItem('wasGuestUser') === 'false';
        if (isCurrentlyLoggedIn) {
          console.log('🔑 User is logged in, ensuring no auto-save');
        } else {
          console.log('👤 User is guest, auto-save enabled');
        }
      });
    }
  }, [searchParams]);

  // Kiểm tra xem kết quả này đã được lưu trong database chưa
  useEffect(() => {
    const checkIfAlreadySaved = async () => {
      if (!isLoggedIn || !result?.type) return;
      
      try {
        const response = await fetch('/api/users/test-history');
        if (response.ok) {
          const history = await response.json();
          
          // Lấy timestamp từ localStorage để so sánh
          const savedTestData = localStorage.getItem('last_test_result');
          let testTimestamp = null;
          if (savedTestData) {
            try {
              const parsed = JSON.parse(savedTestData);
              testTimestamp = parsed.timestamp;
                    } catch {
          console.log('No timestamp in localStorage');
        }
          }
          
          // So sánh dựa trên type và timestamp (nếu có)
          const isSaved = history.some((item: { personalityType: string; createdAt?: string; percentages?: unknown }) => {
            if (item.personalityType !== result.type) return false;
            
            // Nếu có timestamp, so sánh timestamp
            if (testTimestamp && item.createdAt) {
              const itemDate = new Date(item.createdAt);
              const testDate = new Date(testTimestamp);
              const timeDiff = Math.abs(itemDate.getTime() - testDate.getTime());
              // Cho phép sai lệch 5 phút
              return timeDiff < 5 * 60 * 1000;
            }
            
            // Nếu không có timestamp, so sánh percentages
            if (item.percentages && result.actual_percentages) {
              return JSON.stringify(item.percentages) === JSON.stringify(result.actual_percentages);
            }
            
            return false;
          });
          
          if (isSaved) {
            console.log('✅ This result is already saved in database');
            setIsAlreadySaved(true);
            setSaveSuccess(true); // Hiển thị trạng thái đã lưu
          } else {
            console.log('❌ This result is not saved yet');
            setIsAlreadySaved(false);
          }
        }
      } catch (error) {
        console.error('Error checking if result is saved:', error);
      }
    };

    checkIfAlreadySaved();
  }, [isLoggedIn, result]);

  // Kiểm tra xem đây có phải là kết quả từ lịch sử không (không có actual_percentages)
  useEffect(() => {
    if (isLoggedIn && result?.type && !result?.actual_percentages) {
      console.log('📚 This appears to be a result from history (no actual_percentages)');
      setIsAlreadySaved(true);
      setSaveSuccess(true);
    }
  }, [isLoggedIn, result]);

  const fetchPersonalityResult = async (type: string) => {
    try {
      const response = await fetch(`/api/test/result/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch result');
      }
      const data: { success: boolean; data: TestResultData } = await response.json();
      
      // 🎯 LẤY DỮ LIỆU THỰC TẾ TỪ LOCALSTORAGE
      let actualData = null;
      try {
        const saved = localStorage.getItem('last_test_result');
        if (saved) {
          actualData = JSON.parse(saved);
          console.log('🎯 Got actual test data from localStorage:', actualData);
          
          // Kiểm tra xem data có phù hợp với type hiện tại không
          if (actualData.type !== type) {
            console.log('🎯 Test result type mismatch, clearing data');
            actualData = null;
          }
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
      
      setResult({
        ...data.data.personality,
        available_careers: (data.data.careers || []).map((career: {
          _id: string;
          title: string;
          description: string;
          industry?: string;
          salaryRange?: { min: number; max: number; currency: string };
          requiredSkills?: string[];
          educationLevel?: string;
          experienceLevel?: string;
          workEnvironment?: string;
          location?: string;
          jobOutlook?: string;
        }) => ({
          id: career._id,
          title: career.title,
          description: career.description,
          industry: career.industry || '',
          salaryRange: career.salaryRange || { min: 0, max: 0, currency: 'VND' },
          requiredSkills: career.requiredSkills || [],
          educationLevel: career.educationLevel || '',
          experienceLevel: career.experienceLevel || '',
          workEnvironment: career.workEnvironment || '',
          location: career.location || '',
          jobOutlook: career.jobOutlook || ''
        })),
        actual_percentages: actualData?.percentages,
        actual_scores: actualData?.scores,
        total_questions: actualData?.total_questions,
        isLoggedIn: actualData?.isLoggedIn
      } as ExtendedPersonalityInfo);
    } catch (err) {
      setError('Không thể tải kết quả. Vui lòng thử lại sau.');
      console.error('Error fetching result:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const initializeAuth = async () => {
      await checkAuthStatus();
    };
    initializeAuth();
  }, []);

  // Effect để tự động lưu kết quả sau khi đăng nhập thành công (chỉ khi user chưa đăng nhập trước đó)
  useEffect(() => {
    const handleStorageChange = () => {
      // Kiểm tra xem có phải vừa đăng nhập thành công và trước đó chưa đăng nhập không
      const wasLoggedOut = sessionStorage.getItem('wasLoggedOut');
      const wasGuestUser = sessionStorage.getItem('wasGuestUser');
      
      if (wasLoggedOut === 'true' && wasGuestUser === 'true' && isLoggedIn && result?.actual_percentages && !hasAutoSaved) {
        console.log('🔄 Guest user just logged in, auto-saving test result...');
        sessionStorage.removeItem('wasLoggedOut');
        sessionStorage.removeItem('wasGuestUser');
        setAutoSaved(true);
        setHasAutoSaved(true);
        // Tự động lưu kết quả sau 1 giây để đảm bảo state đã cập nhật
        setTimeout(() => {
          saveToHistory();
        }, 1000);
      }
    };

    // Lắng nghe sự thay đổi trong sessionStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Kiểm tra ngay lập tức
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, result]);

  // Reset auto-save state sau 5 giây
  useEffect(() => {
    if (autoSaved) {
      const timer = setTimeout(() => {
        setAutoSaved(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoSaved]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const wasLoggedIn = isLoggedIn;
      setIsLoggedIn(response.ok);
      
      // Cập nhật trạng thái wasGuestUser dựa trên auth status hiện tại
      if (response.ok) {
        sessionStorage.setItem('wasGuestUser', 'false');
      } else {
        sessionStorage.setItem('wasGuestUser', 'true');
      }
      
      // Nếu trước đó chưa đăng nhập và bây giờ đã đăng nhập
      if (!wasLoggedIn && response.ok) {
        console.log('🔄 User just logged in, checking for auto-save...');
        // Đánh dấu rằng user vừa đăng nhập
        sessionStorage.setItem('wasLoggedOut', 'true');
      }
    } catch {
      setIsLoggedIn(false);
      sessionStorage.setItem('wasGuestUser', 'true');
    }
  };

  const saveToHistory = async () => {
    if (!isLoggedIn) {
      // Đánh dấu rằng user này là guest user (chưa đăng nhập)
      sessionStorage.setItem('wasGuestUser', 'true');
      // Chuyển hướng đến trang đăng nhập
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    if (!result?.actual_percentages || !result?.actual_scores) {
      alert('Không có dữ liệu test thực tế để lưu. Vui lòng làm lại bài test.');
      return;
    }

    // Kiểm tra xem đã lưu thành công chưa để tránh lặp lại
    if (saveSuccess) {
      console.log('✅ Result already saved successfully');
      return;
    }

    setIsSaving(true);
    try {
      const testData = JSON.parse(localStorage.getItem('last_test_result') || '{}');
      const lastAnswers = JSON.parse(localStorage.getItem('last_test_answers') || '{}');
      
      if (!testData.type) {
        throw new Error('Không tìm thấy dữ liệu test');
      }

      console.log('💾 Saving test result to history...', testData.type);

      // Gọi API để lưu kết quả
      const response = await fetch('/api/test/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          testResult: testData,
          answers: lastAnswers
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveSuccess(true);
        console.log('✅ Test result saved successfully');
        // Không hiển thị alert nếu đây là auto-save sau đăng nhập
        if (!autoSaved) {
          alert(data.message || 'Kết quả đã được lưu thành công!');
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        if (data.requireLogin) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
        } else {
          throw new Error(data.error || 'Không thể lưu kết quả');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra khi lưu kết quả. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTraitPercentage = (trait: string) => {
    if (!result) return 0;
    
    if (result.actual_percentages) {
      return result.actual_percentages[trait as keyof typeof result.actual_percentages] || 0;
    }
    
    return result.trait_percentages[trait as keyof typeof result.trait_percentages] || 0;
  };

  const getDominantTrait = (traitA: string, traitB: string) => {
    const percentageA = getTraitPercentage(traitA);
    const percentageB = getTraitPercentage(traitB);
    return percentageA > percentageB ? traitA : traitB;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Đang tải kết quả...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !result) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Không tìm thấy kết quả'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Congratulations Section */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircleOutline sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Chúc mừng!
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
            Bạn đã hoàn thành bài kiểm tra MBTI
          </Typography>
          <Typography variant="h4" sx={{ 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 2, 
            p: 2, 
            display: 'inline-block',
            fontWeight: 'bold'
          }}>
            {result.type} - {result.name}
          </Typography>
        </CardContent>
      </Card>

      {/* Personality Description */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Psychology sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Mô tả tính cách
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {result.description}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Ghi chú:</strong> {result.note}
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* MBTI Dimensions Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Tỷ lệ phần trăm các xu hướng MBTI
              </Typography>
            </Box>
            {result.actual_percentages && (
              <Chip 
                icon={<CheckCircleOutline />}
                label={`Dựa trên ${result.total_questions || 0} câu trả lời của bạn`}
                color="success"
                size="small"
              />
            )}
          </Box>
          
          {!result.actual_percentages && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Đây là dữ liệu mẫu chung cho loại tính cách {result.type}. 
                Để có phần trăm chính xác theo bài test của bạn, vui lòng làm lại bài test.
              </Typography>
            </Alert>
          )}
          
          {result.dimensions.map((dimension, index) => {
            const traitA = dimension.trait_a;
            const traitB = dimension.trait_b;
            const percentageA = getTraitPercentage(traitA.id);
            const percentageB = getTraitPercentage(traitB.id);
            const dominant = getDominantTrait(traitA.id, traitB.id);
            
            return (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {dimension.dimension_name_vi}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {traitA.name_en} - {traitA.name_vi}
                          {dominant === traitA.id && (
                            <Chip 
                              label="Xu hướng chính" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentageA}
                        color={getProgressColor(percentageA)}
                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {percentageA}% - {traitA.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {traitA.keywords.map((keyword, idx) => (
                          <Chip key={idx} label={keyword} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      {traitA.examples && traitA.examples.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ví dụ:</strong> {traitA.examples.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {traitB.name_en} - {traitB.name_vi}
                          {dominant === traitB.id && (
                            <Chip 
                              label="Xu hướng chính" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentageB}
                        color={getProgressColor(percentageB)}
                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {percentageB}% - {traitB.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {traitB.keywords.map((keyword, idx) => (
                          <Chip key={idx} label={keyword} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      {traitB.examples && traitB.examples.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ví dụ:</strong> {traitB.examples.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
                
                {index < result.dimensions.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            );
          })}
        </CardContent>
      </Card>

      {/* Career Guidance Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Work sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Định hướng nghề nghiệp chi tiết
            </Typography>
          </Box>

          {/* Block ngành nghề phù hợp từ database - UI đẹp hơn */}
          {result.available_careers && result.available_careers.length > 0 && (
            <Box mb={4}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Ngành nghề phù hợp
              </Typography>
              <Grid container spacing={3}>
                {result.available_careers.map((career) => (
                  <Grid item xs={12} md={6} key={career.id}>
                    <Paper elevation={3} sx={{ p: 3, mb: 2, borderLeft: '5px solid #1976d2', height: '100%' }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {career.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>{career.description}</Typography>
                      <Typography variant="body2"><b>Ngành:</b> {career.industry}</Typography>
                      <Typography variant="body2"><b>Mức lương:</b> {career.salaryRange.min.toLocaleString()} - {career.salaryRange.max.toLocaleString()} {career.salaryRange.currency}</Typography>
                      <Typography variant="body2"><b>Môi trường:</b> {career.workEnvironment}</Typography>
                      <Typography variant="body2"><b>Triển vọng:</b> {career.jobOutlook}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Block Điểm mạnh, Điểm yếu, Lời khuyên phát triển, Phân tích mối quan hệ */}
          {(() => {
            // Ưu tiên lấy từ API (result), fallback sang file tĩnh nếu không có
            const careerDetails = getCareerGuidance(result.type);
            const strengths = result?.strengths && result.strengths.length > 0
              ? result.strengths.map(s => (typeof s === 'string' ? s : (s.title ? `${s.title}: ${s.description}` : s.description)))
              : (careerDetails?.keyStrengths || []);
            const weaknesses = result?.weaknesses && result.weaknesses.length > 0
              ? result.weaknesses.map(s => (typeof s === 'string' ? s : (s.title ? `${s.title}: ${s.description}` : s.description)))
              : (careerDetails?.developmentAreas || []);
            const developmentAdvice = result?.development_advice && result.development_advice.length > 0
              ? result.development_advice
              : (careerDetails?.careerTips || []);
            if (strengths.length === 0 && weaknesses.length === 0 && developmentAdvice.length === 0) return null;
            return (
              <Box mb={4}>
                <Grid container spacing={3}>
                  {/* Điểm mạnh */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CheckCircleOutline sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">Điểm mạnh</Typography>
                        </Box>
                        <List>
                          {strengths.map((s, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <CheckCircleOutline />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">{s}</Typography>} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Điểm yếu */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <HighlightOff sx={{ color: 'error.main', mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">Điểm yếu</Typography>
                        </Box>
                        <List>
                          {weaknesses.map((s, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <HighlightOff />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">{s}</Typography>} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Lời khuyên phát triển */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Psychology sx={{ color: 'warning.main', mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">Lời khuyên phát triển</Typography>
                        </Box>
                        <List>
                          {developmentAdvice.map((s, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <Psychology />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">{s}</Typography>} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            );
          })()}

          {/* Luôn luôn hiển thị block tĩnh bên dưới */}
          {(() => {
            const careerDetails = getCareerGuidance(result.type);
            if (!careerDetails) {
              // Fallback to original career guidance if detailed data not available
              return (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Nhóm ngành nghề phù hợp
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                    {result.career_guidance?.suitable_fields?.map((field, index) => (
                      <Chip key={index} label={field} color="primary" />
                    ))}
                  </Stack>
                  <Typography variant="h6" gutterBottom>
                    Kỹ năng cần cải thiện
                  </Typography>
                  <Grid container spacing={2}>
                    {result.career_guidance?.improvement_skills?.map((skill, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="body2">• {skill}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            }
            // Block tĩnh luôn hiển thị bên dưới
            return (
              <Box>
                {/* Career Overview */}
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Tổng quan nghề nghiệp cho {careerDetails.personalityType}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {careerDetails.overview}
                  </Typography>
                </Box>
                {/* Work Environment, Salary, Outlook ... giữ nguyên như cũ ... */}
                {/* Luôn luôn hiển thị block tĩnh bên dưới */}
                {(() => {
                  // Ưu tiên lấy môi trường từ API (result), fallback sang file tĩnh nếu không có
                  const preferred = result?.work_environment_preferred || careerDetails?.workEnvironment?.preferred || '';
                  const avoid = result?.work_environment_avoid || careerDetails?.workEnvironment?.avoid || '';
                  // Nếu không có cả hai thì không render
                  if (!preferred && !avoid) return null;
                  return (
                    <Box display="flex" justifyContent="center" alignItems="stretch">
                      <Grid container spacing={2} alignItems="stretch">
                        <Grid item xs={12} md={6}>
                          <Paper elevation={2} sx={{ p: 3, backgroundColor: 'success.main', color: 'white', height: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              ✓ Môi trường phù hợp
                            </Typography>
                            <Typography variant="body2">
                              {preferred}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper elevation={2} sx={{ p: 3, backgroundColor: 'error.main', color: 'white', height: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              ✗ Nên tránh
                            </Typography>
                            <Typography variant="body2">
                              {avoid}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })()}
                <Box display="flex" justifyContent="center" alignItems="stretch" mt={2}>
                  <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          💰 Mức lương tham khảo (VN)
                        </Typography>
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            <strong>Mới vào nghề:</strong> {careerDetails.salary_ranges.entry}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Có kinh nghiệm:</strong> {careerDetails.salary_ranges.mid}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Cấp cao:</strong> {careerDetails.salary_ranges.senior}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          📊 Triển vọng ngành
                        </Typography>
                        <Typography variant="body2">
                          {careerDetails.industry_outlook}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            );
          })()}
        </CardContent>
      </Card>

      {/* Save Status Alerts */}
      {!fromHistory && saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Đã lưu kết quả vào lịch sử tài khoản thành công!
        </Alert>
      )}
      
      {!fromHistory && autoSaved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>🎉 Chào mừng trở lại!</strong> Kết quả test của bạn đã được tự động lưu vào lịch sử tài khoản.
          </Typography>
        </Alert>
      )}
      
      {!fromHistory && isAlreadySaved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>✅ Kết quả đã lưu:</strong> Kết quả test này đã được lưu trong lịch sử tài khoản của bạn.
          </Typography>
        </Alert>
      )}
      
      {!fromHistory && !isLoggedIn && result?.actual_percentages && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>💡 Lưu ý:</strong> Bạn chưa đăng nhập. Để lưu kết quả vào lịch sử tài khoản, 
            vui lòng sử dụng nút &quot;Lưu vào lịch sử&quot; bên dưới.
          </Typography>
        </Alert>
      )}
      
      {/* Thông báo khi xem kết quả từ lịch sử */}
      {!fromHistory && isLoggedIn && result?.type && !result?.actual_percentages && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>📚 Kết quả từ lịch sử:</strong> Đây là kết quả test đã được lưu trong lịch sử tài khoản của bạn.
          </Typography>
        </Alert>
      )}
      
      {!fromHistory && isLoggedIn && result?.actual_percentages && !saveSuccess && !isAlreadySaved && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>💾 Lưu kết quả:</strong> Bạn đã đăng nhập. Để lưu kết quả này vào lịch sử tài khoản, 
            vui lòng nhấn nút &quot;Lưu vào lịch sử tài khoản&quot; bên dưới.
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box textAlign="center" mt={4}>
        {/* Nút lưu vào lịch sử - chỉ hiển thị khi có dữ liệu thực tế và chưa lưu */}
        {!fromHistory && result?.actual_percentages && !isAlreadySaved && (
          <Button
            variant="contained"
            size="large"
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ mr: 2 }}
            onClick={saveToHistory}
            disabled={isSaving || saveSuccess}
            color={saveSuccess ? "success" : isLoggedIn ? "primary" : "secondary"}
          >
            {isSaving ? 'Đang lưu...' : 
             saveSuccess ? 'Đã lưu thành công' : 
             isLoggedIn ? 'Lưu vào lịch sử tài khoản' : 
             'Đăng nhập và lưu kết quả'}
          </Button>
        )}
        
        <Button
          variant="contained"
          size="large"
          startIcon={<School />}
          sx={{ mr: 2 }}
          onClick={() => window.open('/careers', '_blank')}
        >
          Khám phá thêm nghề nghiệp
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.print()}
        >
          In kết quả
        </Button>
      </Box>
    </Container>
  );
}

export default function TestResultPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <TestResultContent />
    </Suspense>
  );
} 