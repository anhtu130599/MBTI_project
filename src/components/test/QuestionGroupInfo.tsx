import { Box, Card, CardContent, Typography } from '@mui/material';
import { QuestionGroup } from '@/types/mbti';

interface QuestionGroupInfoProps {
  group: QuestionGroup;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function QuestionGroupInfo({ group, currentQuestionIndex, totalQuestions }: QuestionGroupInfoProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {group.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {group.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Câu hỏi {currentQuestionIndex + 1}/{totalQuestions} trong nhóm
          </Typography>
          <Typography variant="body2" color="primary">
            {group.category}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 