import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              MBTI Quiz
            </Typography>
            <Typography variant="body2">
              Khám phá tính cách của bạn thông qua bài kiểm tra MBTI chuyên nghiệp.
              Tìm hiểu về 16 loại tính cách và cách chúng ảnh hưởng đến cuộc sống của bạn.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Trang chủ
            </Link>
            <Link href="/test" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Làm bài kiểm tra
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Về chúng tôi
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Liên hệ
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Kết nối với chúng tôi
            </Typography>
            <Box sx={{ mb: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Typography variant="body2">
              Email: contact@mbtiquiz.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 