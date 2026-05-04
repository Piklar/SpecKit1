import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Divider } from '@mui/material';

export default function PestModal({ pest, open, onClose }) {
  if (!pest) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">{pest.name}</Typography>
        <Chip label={pest.classification || 'Pest'} color="error" size="small" />
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" paragraph>
          {pest.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="secondary.main">
          How to Get Rid of It
        </Typography>
        <Typography variant="body2" paragraph>
          {pest.mitigation}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Targeted Crops
        </Typography>
        {pest.affectedCrops && pest.affectedCrops.length > 0 ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {pest.affectedCrops.map((crop) => (
              <Chip key={crop._id} label={crop.name} variant="outlined" size="small" />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No specific targeted crops recorded.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
