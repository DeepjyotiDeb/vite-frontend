import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

export const CustomCircular = ({ message }) => {
  return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
          pt: '15px',
          flexGrow: 1
        }}
      >
        <CircularProgress />
      <p style={{  padding: 0, margin: 0, marginTop: '10px' }}>{message}</p>
      </Box>
  );
};
