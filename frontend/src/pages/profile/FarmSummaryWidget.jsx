/**
 * FarmSummaryWidget.jsx — Feature 002 / Phase 5 / T034
 * Shows farm count, active seasonal crops, prevalent pests.
 * Empty state: seasonal crop suggestions + news + "Add Farm" CTA.
 */

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const seasonEmoji = { wet: '🌧️', dry: '☀️' };

/**
 * @param {{
 *   farms: { count: number, list: object[] },
 *   activeCrops: object[],
 *   prevalentPests: object[],
 *   emptyStateSuggestions: { seasonalCrops: object[], news: object[] }
 * }} props
 */
export default function FarmSummaryWidget({ farms = { count: 0, list: [] }, activeCrops = [], prevalentPests = [], emptyStateSuggestions = { seasonalCrops: [], news: [] } }) {
  const navigate = useNavigate();
  const hasNoFarms = farms.count === 0;

  // ── No farms: empty state ──────────────────────────────────────────────────
  if (hasNoFarms) {
    const { seasonalCrops = [], news = [] } = emptyStateSuggestions;
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            🌱 Get Started with Your Farm
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You haven't linked any farms yet. Here are crops you can start growing this season:
          </Typography>

          {/* Seasonal crop chips */}
          {seasonalCrops.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {seasonalCrops.map((c) => (
                <Chip
                  key={c._id}
                  label={`${seasonEmoji[c.season] || '🌿'} ${c.name}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {/* News snippets */}
          {news.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📰 Latest Agricultural News
              </Typography>
              <List dense disablePadding>
                {news.map((n) => (
                  <ListItem key={n._id} disableGutters>
                    <ListItemText
                      primary={n.title}
                      secondary={n.source || new Date(n.datePublished).toLocaleDateString()}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Button
            id="add-farm-cta-btn"
            variant="contained"
            onClick={() => navigate('/farm/add')}
            sx={{ mt: 2 }}
          >
            ➕ Add Your First Farm
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Has farms: summary view ────────────────────────────────────────────────
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            🏡 My Farms
          </Typography>
          <Chip label={`${farms.count} farm${farms.count !== 1 ? 's' : ''}`} color="primary" size="small" />
        </Box>

        {/* Farm list */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {farms.list.map((f) => (
            <Grid item xs={12} sm={6} key={f._id}>
              <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600}>{f.name}</Typography>
                {f.sizeHectares && (
                  <Typography variant="caption" color="text.secondary">
                    {f.sizeHectares} ha
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Active crops */}
        {activeCrops.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              🌾 Active Crops This Season
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {activeCrops.map((c) => (
                <Chip
                  key={c._id}
                  label={`${seasonEmoji[c.season] || '🌿'} ${c.name}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </>
        )}

        {/* Prevalent pests */}
        {prevalentPests.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              🐛 Watch Out For
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {prevalentPests.map((p) => (
                <Tooltip key={p._id} title={p.mitigation} arrow>
                  <Chip label={p.name} size="small" color="warning" variant="outlined" sx={{ cursor: 'help' }} />
                </Tooltip>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Hover a pest for mitigation tips
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
