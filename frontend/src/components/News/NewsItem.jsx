import { Card, CardContent, CardMedia, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Chip, Button } from '@mui/material';
import { Circle as CircleIcon, Launch as LaunchIcon } from '@mui/icons-material';

export default function NewsItem({ article }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={article.imageUrl}
        alt={article.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip label={article.source} size="small" color="primary" variant="outlined" />
          <Typography variant="caption" color="text.secondary">
            {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
          {article.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {article.overview}
        </Typography>
        
        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
            Key Highlights:
          </Typography>
          <List dense disablePadding>
            {article.highlights.map((highlight, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={highlight} 
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Button 
          variant="text" 
          color="primary" 
          endIcon={<LaunchIcon />} 
          sx={{ mt: 2, alignSelf: 'flex-start', textTransform: 'none' }}
          href={article.url}
          target="_blank"
        >
          Read Full Article
        </Button>
      </CardContent>
    </Card>
  );
}
