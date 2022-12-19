import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useState } from 'react';

const CustomErrorTemplate = ({ message }) => {
  const [open, setOpen] = useState(true);
  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleError}>
        <Alert
          variant='filled'
          elevation={6}
          onClose={handleError}
          severity='error'>
          <AlertTitle>Error</AlertTitle>
          {message || ''}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomErrorTemplate;
