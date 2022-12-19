/* eslint-disable react-hooks/exhaustive-deps */
import { Done } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentBook } from './BookSlice';
import { currentUser } from '../../auth/userSlice';
import {
  getBookDetailsApi,
  getThumbnailUrlApi,
  updateBookApi,
  uploadThumbnailApi,
} from '../../../api/authoringApi';
import CircularProgressWithLabel from '../../../elements/CircularProgressWithlabel';
import FileUploader from '../../../elements/FileUploader';

export const EditBook = () => {
  const [state, setState] = useState({
    bookName: '',
    thumbnail: '',
    bookDesc: '',
    publisher: '',
    isThumbnailAdded: false,
    isThumbnailUploaded: false,
    uploadingThumbnail: false,
    percentageThumbnail: 0,
    user: [],
    bookId: '',
    success: false,
    error: false,
    isLoading: false,
    totalSkills: 0,
    changedFields: [],
    data: [],
    addedFiles: null,
  });

  const localBook = useSelector(currentBook);
  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (localBook === undefined || user === undefined) {
      navigate('/login');
    } else {
      // const user = JSON.parse(localStorage.getItem('user'));
      setState((prevState) => ({
        ...prevState,
        user: user,
        book: localBook,
        bookDesc: localBook.bookDesc,
        bookName: localBook.bookName,
        thumbnail: localBook.thumbnail,
        totalPages: localBook.totalPages,
        publisher: localBook.publisher,
        bookId: localBook._id,
      }));
      getBookDetails();
    }
    return () => {};
  }, []);

  // "https://prod.paperflowapp.com/authoring-book/author/book/getBookDetails"
  const getBookDetails = async () => {
    await getBookDetailsApi(
      { bookId: localBook._id },
      { headers: { Authorization: user.token } }
    )
      .then((_res) => {
        // console.log('res getBookDetails', res);
      })
      .catch((error) => {
        console.log('error in getBookDetails', error);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: true,
          errorMessage: error.message,
        }));
      });
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
  const handleThumbnail = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setState((prevState) => ({
        ...prevState,
        thumbnailFile: file,
        isThumbnailAdded: true,
        isThumbnailUploaded: false,
      }));
    }
  };
  const uploadThumbnail = async (e) => {
    e.preventDefault();
    const { thumbnailFile } = state;
    setState((prevState) => ({ ...prevState, uploadingThumbnail: true }));
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setState((prevState) => ({
          ...prevState,
          percentageThumbnail: percent,
        }));
      },
    };
    // 'https://prod.paperflowapp.com/authoring-book/book/thumbnailUploadUrl'
    await uploadThumbnailApi(
      {
        fileName: thumbnailFile.name,
        type: thumbnailFile.type,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then(async (response) => {
        await getThumbnailUrlApi(
          response.data.uploadUrl,
          thumbnailFile,
          options
        )
          .then((res) => {
            setState((prevState) => ({
              ...prevState,
              thumbnail: res.config.url.split('?')[0],
            }));
            const tempEvent = {
              target: {
                value: res.config.url.split('?')[0],
                name: 'thumbnail',
              },
            };
            updateFields(tempEvent);
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                uploadingThumbnail: false,
                isThumbnailUploaded: true,
              }));
            }, 4000);
          })
          .catch(() => {
            setState((prevState) => ({
              ...prevState,
              uploadingThumbnail: false,
              isThumbnailUploaded: false,
            }));
          });
      })
      .catch(() => {
        setState((prevState) => ({
          ...prevState,
          uploadingThumbnail: false,
          isThumbnailUploaded: false,
        }));
      });
  };
  // "https://prod.paperflowapp.com/authoring-no-aruco-book/book/update"
  const updateBook = async () => {
    let updateObj = {};
    for (const field of state.changedFields) {
      updateObj[field] = state[field];
    }
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await updateBookApi(
      { bookId: localBook._id, ...updateObj },
      { headers: { Authorization: user.token } }
    )
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          success: true,
          isLoading: false,
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
            success: false,
          }));
          navigate('/authoring/books');
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

  const handleChange = (e) => {
    let { name, type, value } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setState({ ...state, [name]: value });
  };

  const updateFields = (e) => {
    if (
      e.target.value !== localBook[e.target.name] &&
      state.changedFields.indexOf(e.target.name) === -1
    ) {
      setState((prevState) => ({
        ...prevState,
        changedFields: [...state.changedFields, e.target.name],
      }));
    } else if (e.target.value === localBook[e.target.name]) {
      setState((prevState) => ({
        ...prevState,
        changedFields: state.changedFields.filter(
          (field) => field !== e.target.name
        ),
      }));
    }
  };

  return (
    <>
      <BreadcrumbsItem to={`/home/books/${localBook._id}/editBook`}>
        Edit Book
      </BreadcrumbsItem>
      <Box>
        <Paper
          sx={{
            minWidth: '500px',
            width: '100%',
            maxWidth: '80%',
            flexGrow: 1,
            margin: 'auto',
          }}
          component='form'
        >
          <Grid
            spacing={1}
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item>
              <TextField
                style={{ width: '400px' }}
                margin='normal'
                required
                size='medium'
                type='text'
                id='bookName'
                name='bookName'
                value={state.bookName}
                label='Book Name'
                onBlur={updateFields}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                style={{ width: '400px' }}
                margin='normal'
                size='medium'
                type='text'
                id='publisher'
                name='publisher'
                value={state.publisher}
                label='Publisher Name'
                onBlur={updateFields}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                style={{ width: '400px' }}
                margin='normal'
                required
                size='medium'
                type='text'
                id='bookDesc'
                name='bookDesc'
                value={state.bookDesc}
                label='Book Description'
                onBlur={updateFields}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                style={{ width: '400px' }}
                margin='normal'
                required
                size='medium'
                type='number'
                id='totalPages'
                name='totalPages'
                InputProps={{
                  inputProps: { min: 1, max: 2000 },
                  readOnly: true,
                }}
                value={state.totalPages || 0}
                label='Pages'
              />
            </Grid>
            <Grid
              item
              xs
              sm
              sx={{
                width: 410,
              }}
            >
              <FileUploader
                disabled={false}
                fileTypes='images'
                multiple={false}
                onDrop={handleFileChange}
                onDropAccept={handleThumbnail}
                onDropReject={handleReject}
                onDropError={handleDropError}
                progressBar={false}
                name='thumbnail'
                label='Browse or Drag & Drop book thumbnail .jpeg, .png file here'
              >
                <div style={{ marginTop: '8px' }}>
                  {state.isThumbnailUploaded ? (
                    <Done style={{ color: '#4BB543' }} />
                  ) : state.uploadingThumbnail ? (
                    <CircularProgressWithLabel
                      value={state.percentageThumbnail}
                    />
                  ) : (
                    <Button
                      disabled={!state.isThumbnailAdded}
                      width='auto'
                      variant='contained'
                      color='primary'
                      // className={classes.uploadButton}
                      onClick={uploadThumbnail}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </FileUploader>
            </Grid>

            <Grid item xs my={3}>
              <LoadingButton
                disabled={!state.changedFields.length}
                loading={state.isLoading}
                width='auto'
                variant='contained'
                color='primary'
                className='submitButton'
                onClick={() => updateBook()}
              >
                Update Book
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {state.success && (
        <Snackbar
          open={state.success}
          autoHideDuration={3000}
          onClose={handleSuccess}
        >
          <Alert onClose={handleSuccess} variant='filled' severity='success'>
            <Typography variant='body2'>Book Created Successfully</Typography>
          </Alert>
        </Snackbar>
      )}

      {state.error && (
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
            <Typography variant='body2'>{state.errorMessage}</Typography>
            {/* Incorrect OTP! Please Try again! */}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
