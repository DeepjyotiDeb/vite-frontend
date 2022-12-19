import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { forwardRef } from 'react';

export const CustomSnackbar = ({ toast, setToast }) => {
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const handClose = () => {
    setToast((prevState) => ({
      ...prevState,
      state: false,
    }));
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical:
          toast.positionVertical === undefined ? 'top' : toast.positionVertical,
        horizontal:
          toast.positionHorizontal === undefined
            ? 'center'
            : toast.positionHorizontal,
      }}
      open={toast.state}
      autoHideDuration={8000}
      onClose={handClose}
      sx={{ zIndex: 300 }}
    >
      <Alert
        onClose={handClose}
        severity={toast.severity}
        sx={{ width: '100%', fontSize: 14, zIndex: 300 }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};
