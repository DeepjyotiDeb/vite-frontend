/* eslint-disable unused-imports/no-unused-vars */
import { Done } from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
// import { PDFDocument } from 'pdf-lib';
import React, { useState } from 'react';

import CircularProgressWithLabel from './CircularProgressWithlabel';
import FileUploader from './FileUploader';
import { addPagesApi, getFileUrlApi, uploadPageApi } from '../api/authoringApi';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  uploadButton: {
    background: '#005792',
    borderRadius: '2px',
    color: '#FBFAF2',
    fontFamily: 'Rubik',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'none',
    width: '150px',
  },
  fileButton: {
    background: '#005792',
    borderRadius: '2px',
    color: '#FBFAF2',
    fontFamily: 'Rubik',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'none',
  },
  progress: {
    maxWidth: '100px',
    width: '80px',
    height: '80px',
  },
  bookType: {
    width: '300px',
    margin: '20px 0',
  },
  submit: {
    borderColor: '#1ECD97',
    color: '#1ECD97',
  },
}));
const AddPage = ({
  isShowing,
  hide,
  maxWidth,
  fullWidth,
  // handleMaxWidthChange,
  // handleFullWidthChange,
  user,
  book,
  getBookDetailsFunction,
  // ...props
}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    totalPages: 0,
    isThumbnailAdded: false,
    isThumbnailUploaded: false,
    uploadingThumbnail: false,
    percentageThumbnail: 0,
    pdf: '',
    isPdfAdded: false,
    isPdfUploaded: false,
    uploadingPdf: false,
    percentagePDF: 0,
    success: false,
    error: false,
    isLoading: false,
    pdfUrl: '',
    addedFiles: null,
  });

  const handlePDF = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const numPages = await getPages(file);
      setState((prevState) => ({
        ...prevState,
        pdf: file,
        totalPages: numPages.length,
        isPdfAdded: true,
        isPdfUploaded: false,
      }));
    }
  };

  const handleFileChange = (files) => {
    setState((prevState) => ({
      ...prevState,
      addedFiles: files,
    }));
  };

  const handleReject = (e) => {
    console.log('handleReject', e);
  };
  const handleDropError = (e) => {
    console.log('handleDropError', e);
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  };

  const getPages = async (file) => {
    const arrayBuffer = await readFile(file);

    // const pdf = await PDFDocument.load(arrayBuffer);

    // return pdf.getPages();
  };

  const uploadPDF = async (e) => {
    e.preventDefault();
    const { pdf } = state;
    setState((prevState) => ({ ...prevState, uploadingPdf: true }));
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setState((prevState) => ({ ...prevState, percentagePDF: percent }));
      },
    };

    // 'https://prod.paperflowapp.com/authoring-book/book/pdfUploadUrl'

    await uploadPageApi(
      {
        fileName: pdf.name,
        type: pdf.type,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then((response) => {
        getFileUrlApi(response.data.uploadUrl, pdf, options)
          .then((res) => {
            console.log(res);
            setState((prevState) => ({
              ...prevState,
              pdfUrl: res.config.url.split('?')[0],
            }));
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                uploadingPdf: false,
                isPdfUploaded: true,
              }));
            }, 4000);
          })
          .catch((error) => {
            setState((prevState) => ({
              ...prevState,
              uploadingPdf: false,
              isPdfUploaded: false,
            }));
          });
      })
      .catch((error) => {
        setState((prevState) => ({ ...prevState, uploadingPdf: false }));
      });
  };

  const validateBookForm = () => {
    return state.isPdfUploaded;
  };

  // "https://prod.paperflowapp.com/authoring-no-aruco-book/book/addPages"
  const addPages = async (e) => {
    e.preventDefault();

    await addPagesApi(
      {
        authorId: user._id,
        bookId: book._id,
        pdfUrl: state.pdfUrl,
        totalPages: state.totalPages,
        currentPages: book.totalPages,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then(async (response) => {
        setState((prevState) => ({
          ...prevState,
          success: true,
          isLoading: false,
        }));
        getBookDetailsFunction();
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
            success: false,
          }));
          hide();
        }, 3000);
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: true,
          errorMessage: error.message,
        }));
      });
  };

  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState((prevState) => ({ ...prevState, success: false }));
  };

  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState((prevState) => ({ ...prevState, error: false }));
  };
  return isShowing ? (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isShowing}
        onClose={hide}
        aria-labelledby='file-upload-dialog-title'
      >
        <DialogTitle id='file-upload-dialog-title'>
          Upload new pages
        </DialogTitle>
        <DialogContent>
          <Grid
            spacing={1}
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item>
              <Typography variant='subtitle1' display='block' gutterBottom>
                PDF Name : {state.pdf.name || `No File is selected`}
              </Typography>

              <Typography variant='subtitle1' display='block' gutterBottom>
                New Pages : {state.totalPages}
              </Typography>
            </Grid>
            <Grid item>
              <FileUploader
                disabled={false}
                fileTypes='pdf'
                multiple={false}
                onDrop={handleFileChange}
                onDropAccept={handlePDF}
                onDropReject={handleReject}
                onDropError={handleDropError}
                progressBar={false}
                label='Browse or Drag & Drop Book PDF File here'
              >
                <div style={{ marginTop: '8px' }}>
                  {state.isPdfUploaded ? (
                    <Done style={{ color: '#4BB543' }} />
                  ) : state.uploadingPdf ? (
                    <CircularProgressWithLabel value={state.percentagePDF} />
                  ) : (
                    <Button
                      disabled={!state.isPdfAdded}
                      width='auto'
                      variant='contained'
                      color='primary'
                      className={classes.uploadButton}
                      onClick={uploadPDF}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </FileUploader>
              {/* <div className='thumbnailUpload'>
                <div className='uploader'>
                  <input
                    accept='application/pdf'
                    className={classes.input}
                    id='pdf-file'
                    type='file'
                    onChange={handlePDF}
                  />
                  <label htmlFor='pdf-file' className='custom-file-upload'>
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.fileButton}
                      component='span'
                      startIcon={<MenuBook />}>
                      Select PDF File
                    </Button>
                  </label>
                </div>
                <div>
                  {state.isPdfUploaded ? (
                    <Done style={{ color: '#4BB543' }} />
                  ) : (
                    <Button
                      disabled={!state.isPdfAdded}
                      width='auto'
                      variant='contained'
                      color='primary'
                      className={classes.uploadButton}
                      onClick={uploadPDF}>
                      Upload PDF
                    </Button>
                  )}
                </div>
                {state.uploadingPdf ? (
                  <CircularProgressbar
                    value={state.percentagePDF}
                    text={
                      <tspan
                        dx={-10}
                        dy={5}>
                        {state.percentagePDF}%
                      </tspan>
                    }
                    className={classes.progress}
                    styles={buildStyles({
                      // Colors
                      pathColor: `rgba(62, 152, 199, ${
                        state.percentagePDF / 100
                      })`,
                      textColor: '#e23e57',
                      trailColor: '#D6E4F0',
                      backgroundColor: '#163172',
                      width: '60px',
                      height: '60px',
                    })}
                  />
                ) : (
                  <div></div>
                )}
              </div> */}
            </Grid>
            <Grid item>
              <Button
                disabled={!validateBookForm()}
                width='auto'
                variant='outlined'
                className={classes.submit}
                onClick={addPages}
              >
                Add Pages
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide} color='primary'>
            Close
          </Button>
        </DialogActions>
        {state.success ? (
          <div>
            <Snackbar
              open={state.success}
              autoHideDuration={3000}
              onClose={handleSuccess}
            >
              <Alert
                onClose={handleSuccess}
                variant='filled'
                severity='success'
              >
                <Typography variant='body2'>
                  Book Created Successfully
                </Typography>
              </Alert>
            </Snackbar>
          </div>
        ) : (
          <div></div>
        )}

        {state.error ? (
          <div>
            <Snackbar
              open={state.error}
              autoHideDuration={3000}
              onClose={handleError}
            >
              <Alert
                variant='filled'
                elevation={6}
                onClose={handleError}
                severity='error'
              >
                <Typography variant='body2'>
                  Book Page update error occured try again after sometime!
                </Typography>
                {/* Incorrect OTP! Please Try again! */}
              </Alert>
            </Snackbar>
          </div>
        ) : (
          <div></div>
        )}
      </Dialog>
    </>
  ) : null;
};

export default AddPage;
