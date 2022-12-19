/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorOutline, FileDownload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IsoTimeConverter from '../../Smartpaper/HelperFunctions/IsoTimeConverter';
import { exportResults } from '../../../api/api';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';

export const DeleteDialog = (props) => {
  const { handleDialog, setHandleDialog, onDelete } = props;

  const handleClose = () => {
    setHandleDialog((prevState) => ({
      ...prevState,
      handleDialog: false,
    }));
  };

  return (
    <Dialog open={handleDialog} onClose={handleClose}>
      <DialogTitle>{`Delete Result(s)`}</DialogTitle>
      <DialogContent>
        <DialogContentText variant='h6'>
          {`Are you sure you wish to remove the selected result(s) from the report?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleClose}
          sx={{
            mr: 3,
            mb: 1.5,
          }}
        >
          cancel
        </Button>
        <Button
          variant='outlined'
          startIcon={<ErrorOutline />}
          color='error'
          onClick={() => {
            onDelete();
            handleClose();
          }}
          sx={{
            mr: 4,
            mb: 1.5,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ExportResult = ({
  testName,
  startDate,
  endDate,
  // userName,
  orgName,
}) => {
  const navigate = useNavigate();
  const [loaderBool, setLoaderBool] = useState(false);
  const [toast, setToast] = useState({
    state: false,
    severity: 'error',
    message: '',
  });

  const handleClick = async () => {
    const TstartDate = IsoTimeConverter(startDate).split('T')[0] + 'T00:00:00';
    const TendDate = IsoTimeConverter(endDate).split('T')[0] + 'T23:59:59';
    let obj = {
      testId: testName,
      startDate: TstartDate,
      endDate: TendDate,
      organizationId: orgName,
    };
    setLoaderBool(true);
    await exportResults(obj)
      .then((result) => {
        // router.push(result.data.data);
        // navigate(result.data);
        window.open(result.data, '_blank');
        setLoaderBool(false);
        // console.log('result', result);
        setToast({
          state: true,
          severity: 'success',
          message: 'results exported',
        });
      })
      .catch((error) => {
        console.log('error', error);
        setLoaderBool(false);
        setToast((prevState) => ({
          ...prevState,
          state: true,
          message: 'No reports available for the chosen test',
        }));
      });
  };
  return (
    <>
      <LoadingButton
        variant='contained'
        loadingPosition='end'
        endIcon={<FileDownload />}
        loading={loaderBool}
        sx={{
          width: '150px',
          height: '35px',
          fontSize: '13.5px',
          borderRadius: '10px',
          mb: 0.5,
          backgroundColor: 'rgb(32, 70, 155)',
          '&:hover': {
            backgroundColor: '#1a237e',
          },
        }}
        onClick={() => {
          handleClick();
        }}
      >
        Export all
      </LoadingButton>
      <CustomSnackbar toast={toast} setToast={setToast} />
    </>
  );
};
