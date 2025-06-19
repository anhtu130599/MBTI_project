'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  TrendingUp,
  Work,
  Group,
  Star,
  Warning,
  Lightbulb,
  Celebration,
  School,
  CheckCircle,
  Save,
  // Login, // Not used
} from '@mui/icons-material';
import { PersonalityDetailInfo } from '@/core/domain/entities/MBTIDimensionInfo';

interface ExtendedPersonalityInfo extends PersonalityDetailInfo {
  available_careers: Array<{
    id: string;
    title: string;
    description: string;
    salary_range?: string;
    requirements?: string[];
    location_type?: string;
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

function TestResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ExtendedPersonalityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      fetchPersonalityResult(type);
    }
  }, [searchParams]);

  const fetchPersonalityResult = async (type: string) => {
    try {
      const response = await fetch(`/api/test/result/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch result');
      }
      const data = await response.json();
      
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
        ...data.data,
        actual_percentages: actualData?.percentages,
        actual_scores: actualData?.scores,
        total_questions: actualData?.total_questions,
        isLoggedIn: actualData?.isLoggedIn
      });
    } catch (err) {
      setError('Không thể tải kết quả. Vui lòng thử lại sau.');
      console.error('Error fetching result:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      setIsLoggedIn(response.ok);
    } catch {
      setIsLoggedIn(false);
    }
  };

  const saveToHistory = async () => {
    if (!isLoggedIn) {
      // Chuyển hướng đến trang đăng nhập
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }

    if (!result?.actual_percentages || !result?.actual_scores) {
      alert('Không có dữ liệu test thực tế để lưu. Vui lòng làm lại bài test.');
      return;
    }

    setIsSaving(true);
    try {
      const testData = JSON.parse(localStorage.getItem('last_test_result') || '{}');
      const lastAnswers = JSON.parse(localStorage.getItem('last_test_answers') || '{}');
      
      if (!testData.type) {
        throw new Error('Không tìm thấy dữ liệu test');
      }

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
        alert(data.message || 'Kết quả đã được lưu thành công!');
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
          <Celebration sx={{ fontSize: 60, mb: 2 }} />
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
                icon={<CheckCircle />}
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

      {/* Strengths & Weaknesses */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Điểm mạnh và điểm yếu
          </Typography>
          
          {/* Strengths */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Star sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Điểm mạnh ({result.strengths.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {result.strengths.map((strength, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        {strength.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {strength.description}
                      </Typography>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Tại sao bạn có điểm mạnh này:</strong> {strength.why_explanation}
                        </Typography>
                      </Alert>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Weaknesses */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Điểm yếu ({result.weaknesses.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {result.weaknesses.map((weakness, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                      <Typography variant="h6" color="warning.main" gutterBottom>
                        {weakness.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {weakness.description}
                      </Typography>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Tại sao bạn có điểm yếu này:</strong> {weakness.why_explanation}
                        </Typography>
                      </Alert>
                      <Alert severity="success">
                        <Typography variant="body2">
                          <strong>Lời khuyên cải thiện:</strong> {weakness.improvement_advice}
                        </Typography>
                      </Alert>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Development Advice */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Lightbulb sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Lời khuyên phát triển
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {result.development_advice.map((advice, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="body1">
                    {advice}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Relationship Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Group sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Phân tích mối quan hệ
            </Typography>
          </Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Cách tương tác với người khác
            </Typography>
            <Typography variant="body1" paragraph>
              {result.relationship_analysis.interaction_style}
            </Typography>
          </Paper>
          
          <Typography variant="h6" gutterBottom>
            Lời khuyên cải thiện mối quan hệ
          </Typography>
          <Grid container spacing={2}>
            {result.relationship_analysis.improvement_tips.map((tip, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="body2">
                    • {tip}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Career Guidance */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Work sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Định hướng nghề nghiệp
            </Typography>
          </Box>
          
          {/* Suitable Fields */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Nhóm ngành nghề phù hợp
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {result.career_guidance.suitable_fields.map((field, index) => (
                <Chip key={index} label={field} color="primary" />
              ))}
            </Stack>
          </Box>

          {/* Available Careers */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Nghề nghiệp cụ thể trong cơ sở dữ liệu
            </Typography>
            <Grid container spacing={2}>
              {result.available_careers.slice(0, 6).map((career, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {career.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {career.description}
                    </Typography>
                    {career.salary_range && (
                      <Typography variant="body2" color="primary">
                        <strong>Mức lương:</strong> {career.salary_range}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Improvement Skills */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Kỹ năng cần cải thiện để làm tốt công việc
            </Typography>
            <Grid container spacing={2}>
              {result.career_guidance.improvement_skills.map((skill, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="body2">
                      • {skill}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Save Status Alerts */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Đã lưu kết quả vào lịch sử tài khoản thành công!
        </Alert>
      )}
      
      {!isLoggedIn && result?.actual_percentages && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>💡 Lưu ý:</strong> Bạn chưa đăng nhập. Để lưu kết quả vào lịch sử tài khoản, 
            vui lòng sử dụng nút &quot;Lưu vào lịch sử&quot; bên dưới.
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box textAlign="center" mt={4}>
        {/* Nút lưu vào lịch sử - luôn hiển thị */}
        {result?.actual_percentages && (
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