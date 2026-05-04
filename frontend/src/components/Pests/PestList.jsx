import { Grid, Alert } from '@mui/material';
import PestItem from './PestItem';

export default function PestList({ pests, onOpenModal }) {
  if (!pests || pests.length === 0) {
    return <Alert severity="info">No pests found in the database.</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {pests.map((pest) => (
        <Grid item key={pest._id} xs={12} sm={6} md={4}>
          <PestItem pest={pest} onOpenModal={onOpenModal} />
        </Grid>
      ))}
    </Grid>
  );
}
