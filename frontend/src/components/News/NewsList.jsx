import { Grid } from '@mui/material';
import NewsItem from './NewsItem';

export default function NewsList({ articles }) {
  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item xs={12} md={6} lg={4} key={article.id}>
          <NewsItem article={article} />
        </Grid>
      ))}
    </Grid>
  );
}
