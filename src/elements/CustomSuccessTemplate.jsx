import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useState } from 'react';

const CustomSuccessTemplate = ({ message }) => {
  const [open, setOpen] = useState(true);
  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={3000}
      onClose={handleSuccess}>
      <Alert
        onClose={handleSuccess}
        variant='filled'
        elevation={6}
        severity='success'>
        <AlertTitle>Success</AlertTitle>
        {message || ''}
      </Alert>
    </Snackbar>
  );
};

export default CustomSuccessTemplate;
