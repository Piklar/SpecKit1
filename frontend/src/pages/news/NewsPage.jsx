import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import NewsList from '../../components/News/NewsList';
import dummyNews from '../../data/dummyNews.json';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setArticles(dummyNews);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
            Agricultural News
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with the latest news, guidelines, and highlights affecting the farming community.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <NewsList articles={articles} />
        )}
      </Container>
    </Box>
  );
}
