import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import { TestConfig } from '@/types/mbti';

interface TestIntroductionProps {
  config: TestConfig;
  onStart: () => void;
}

export default function TestIntroduction({ config, onStart }: TestIntroductionProps) {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          {config.introduction.title}
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="body1" paragraph>
              {config.introduction.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Thời gian: {config.introduction.duration}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Số câu hỏi: {config.introduction.totalQuestions}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Các nhóm câu hỏi
          </Typography>
          
          {config.groups.map((group, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {group.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onStart}
          >
            Bắt đầu kiểm tra
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 