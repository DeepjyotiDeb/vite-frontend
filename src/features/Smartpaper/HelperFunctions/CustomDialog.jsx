/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorOutline } from '@mui/icons-material';
import { Button, DialogActions, Paper, Stack, styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px'
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const buttonStyle = {
  mt: 2,
  mr: 2
};
// export function CustomDialog(props) {
export const CustomDialog = props => {
  const { children, onClose, open, title, ans, reportError, ...other } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <Item>Que No : {ans?.queNo}</Item>
          <Item>Student Ans: {ans?.studentAnswer}</Item>
          <Item
            style={{
              backgroundColor: '#3cff00'
            }}
          >
            Correct Ans: {ans?.correctAnswer[0]}
          </Item>
        </Stack>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<ErrorOutline />}
          color="error"
          onClick={reportError}
        >
          Error
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// export default CustomDialog;

export const ResetDialog = props => {
  const { children, onClose, open, onReset, ...other } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Clear Results`}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6">
          {t('areYouSureClearResults')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          sx={{
            mr: 8,
            mb: 1.5
          }}
        >
          {t('no')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ErrorOutline />}
          color="error"
          onClick={e => {
            onReset(e);
            onClose();
          }}
          sx={{
            mr: 4,
            mb: 1.5
          }}
        >
          {t('clear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const SameErrorImageModal = ({
  sameImage,
  sameImageFunction,
  errorType,
  errorTextValue
}) => {
  // console.log("test",sameImage)
  const [customOpen, setCustomOpen] = useState(sameImage);

  return (
    <div>
      {/* <Button onClick={() => setCustomOpen(!sameImage)}>Open modal</Button> */}
      <Dialog
        open={sameImage}
        onClose={() => {
          setCustomOpen(!sameImage);
          // console.log('sameImage', sameImage);
          sameImageFunction(sameImage);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>{errorType}</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h6">{errorTextValue}</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const RefImgDialog = ({ open, handleClose, handleClick }) => {
  return (
    <>
      <Dialog
        // open={refImgProps.refImgState && imgOnScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Change Test'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" variant="h6">
            Warning: Changing tests will clear all data. Are you sure, you wish
            to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={e => {
              handleClick(e);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
