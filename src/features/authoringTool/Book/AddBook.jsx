import { Done } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
// import { PDFDocument } from 'pdf-lib';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';
import {
  getBookUrlApi,
  getThumbnailUrlApi,
  submitBookApi,
  uploadBookApi,
  uploadThumbnailApi,
} from '../../../api/authoringApi';
import CircularProgressWithLabel from '../../../elements/CircularProgressWithlabel';
import FileUploader from '../../../elements/FileUploader';

const AddBook = () => {
  const [state, setState] = useState({
    bookName: '',
    thumbnail: '',
    bookDesc: '',
    publisher: '',
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
    author: [],
    success: false,
    error: false,
    isLoading: false,
    totalSkills: 0,
    columns: [
      {
        title: 'Skill',
        field: 'skillName',
        cellStyle: {
          width: '200px',
        },
      },
      //{ title: "Skill ID", field: "skillid" },
      {
        title: 'items',
        field: 'items',
        editable: 'never',
        cellStyle: {
          width: '50px',
        },
      },
    ],
    addedFiles: null,
    data: [],
    bookType: 'Practice',
  });

  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    // const author = JSON.parse(localStorage.getItem('user'));
    if (user === null) return;
    // console.log('user', user);
    setState((prevState) => ({
      ...prevState,
      author: user,
    }));
    return () => {};
  }, [user]);

  const handlePDF = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const numPages = await getPages(file);
      setState((prevState) => ({
        ...prevState,
        pdfFile: file,
        totalPages: numPages.length,
        isPdfAdded: true,
        isPdfUploaded: false,
      }));
    }
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
  const handleThumbnail = (e) => {
    var files = e.target.files;
    // console.log(files);
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
    setState((prevState) => ({
      ...prevState,
      uploadingThumbnail: true,
    }));
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
          Authorization: user.currentUser.token,
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
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                uploadingThumbnail: false,
                isThumbnailUploaded: true,
              }));
            }, 4000);
          })
          .catch((_error) => {
            setState((prevState) => ({
              ...prevState,
              uploadingThumbnail: false,
              isThumbnailUploaded: false,
            }));
          });
      })
      .catch((_error) => {
        setState((prevState) => ({
          ...prevState,
          uploadingThumbnail: false,
          isThumbnailUploaded: false,
        }));
      });
  };
  const uploadPDF = async (e) => {
    e.preventDefault();
    const { pdfFile } = state;
    setState((prevState) => ({ ...prevState, uploadingPdf: true }));
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setState((prevState) => ({ ...prevState, percentagePDF: percent }));
      },
    };

    await uploadBookApi(
      {
        fileName: pdfFile.name,
        type: pdfFile.type,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then(async (response) => {
        getBookUrlApi(response.data.uploadUrl, pdfFile, options)
          .then((res) => {
            setState((prevState) => ({
              ...prevState,
              pdf: res.config.url.split('?')[0],
            }));
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                uploadingPdf: false,
                isPdfUploaded: true,
              }));
            }, 4000);
          })
          .catch((_error) => {
            setState((prevState) => ({
              ...prevState,
              uploadingPdf: false,
              isPdfUploaded: false,
            }));
          });
      })
      .catch((_error) => {
        setState((prevState) => ({ ...prevState, uploadingPdf: false }));
      });
  };

  const handleFileChange = (files) => {
    setState((prevState) => ({
      ...prevState,
      addedFiles: files,
    }));
    // console.log(state);
  };

  const handleReject = (e) => {
    console.log('handleReject', e);
  };
  const handleDropError = (e) => {
    console.log('handleDropError', e);
  };

  const bookSubmit = async () => {
    const { _id, organizationId } = state.author;
    console.log(organizationId, user.organizationId);
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await submitBookApi(
      {
        organizationId: organizationId,
        authorId: _id,
        bookName: state.bookName,
        thumbnail:
          state.thumbnail ||
          'https://edusense-thumbnails.s3.ap-south-1.amazonaws.com/generic_book.png',
        pdfUrl: state.pdf,
        totalPages: state.totalPages,
        publisher: state.publisher,
        bookDesc: state.bookDesc,
        bookType: state.bookType,
        currentPages: 0,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then((_response) => {
        // setState((prevState) => ({
        //   ...prevState,
        //   success: true,
        //   isLoading: false,
        // }));
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
  const validateBookForm = () => {
    return (
      state.bookName.length > 0 && state.totalPages > 0 && state.isPdfUploaded
    );
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
  return (
    <>
      <BreadcrumbsItem to='/authoring/books/addBook'>Add Book</BreadcrumbsItem>
      <form
        style={{
          // width: '60%',
          margin: 'auto',
          // minWidth: '500px',
          // maxWidth: '100%',
        }}
      >
        <Paper elevation={3} sx={{ px: '3rem', py: '1rem' }}>
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            width='100%'
            gap={5}
          >
            <Grid
              spacing={2}
              container
              direction='column'
              maxWidth='25rem'
              // justifyContent='center'
              // alignItems='center'
            >
              <Grid item>
                <Typography variant='h5' style={{ marginTop: '5px' }}>
                  Add Book
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  // style={{ width: '400px' }}
                  // margin='normal'
                  required
                  fullWidth
                  type='text'
                  id='bookName'
                  name='bookName'
                  value={state.bookName}
                  label='Name'
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      bookName: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item>
                <FormControl
                  required
                  // size='medium'
                  fullWidth
                  // style={{ width: '400px' }}
                >
                  <InputLabel id='bookType-label'>Type</InputLabel>
                  <Select
                    labelId='bookType'
                    value={state.bookType}
                    id='bookType'
                    name='bookType'
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        bookType: e.target.value,
                      }))
                    }
                    label='Type'
                    defaultValue='Practice'
                  >
                    <MenuItem value='Practice' selected>
                      Practice
                    </MenuItem>
                    {/* <MenuItem value="Survey">Survey</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  // style={{ width: '400px' }}
                  // margin='normal'
                  // size='medium'
                  type='text'
                  fullWidth
                  id='publisher'
                  name='publisher'
                  value={state.publisher}
                  label='Publisher'
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      publisher: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  // style={{ width: '400px' }}
                  // margin='normal'
                  // size='medium'
                  fullWidth
                  type='text'
                  id='bookDesc'
                  name='bookDesc'
                  value={state.bookDesc}
                  label='Description'
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      bookDesc: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  // style={{ width: '400px' }}
                  // margin='normal'
                  required
                  // size='medium'
                  fullWidth
                  type='number'
                  id='totalPages'
                  name='totalPages'
                  InputProps={{
                    // inputProps: { min: 0, max: 2000 },
                    readOnly: true,
                  }}
                  value={state.totalPages || 0}
                  label='PDF Pages'
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      totalPages: parseInt(e.target.value),
                    }))
                  }
                />
              </Grid>

              <Grid
                item
                width='100%'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                mt={0.5}
              >
                <LoadingButton
                  disabled={!validateBookForm()}
                  loading={state.isLoading}
                  width='auto'
                  variant='contained'
                  color='primary'
                  className='submitButton'
                  onClick={() => bookSubmit()}
                  sx={{ maxWidth: '8rem' }}
                >
                  Create Book
                </LoadingButton>
              </Grid>
            </Grid>
            {/** file uploaders */}
            <Grid
              spacing={1}
              container
              direction='column'
              // justifyContent='center'
              // alignItems='center'
              mt={3}
              maxWidth='30rem'
            >
              <Grid
                item
                xs
                sm
                sx={
                  {
                    // width: '410px',
                  }
                }
              >
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
                        onClick={uploadPDF}
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </FileUploader>
              </Grid>
              <Grid
                item
                xs
                sm
                sx={
                  {
                    // width: 410,
                  }
                }
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
                        onClick={uploadThumbnail}
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </FileUploader>
              </Grid>
            </Grid>
            {/** file uploaders */}
          </Box>
        </Paper>
      </form>
      {state.success && (
        <Snackbar
          open={state.success}
          autoHideDuration={3000}
          onClose={handleSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

export default AddBook;
