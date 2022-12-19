/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-inner-declarations */

import { Edit, GetApp } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import JsFileDownloader from 'js-file-downloader';
import { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
// import { pdfjs } from 'react-pdf';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentBook } from '../Book/BookSlice';
import useModal from '../Book/Hooks/useModal';
import { currentUser, setCurrentUser } from '../../auth/userSlice';
import { getSplitPagesApi } from '../../../api/authoringApi';
import AddPage from '../../../elements/AddPage';

/* const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: '0px',
    padding: '0px',
    width: '300',
    outline: 'none',
    fontSize: '0px',
    lineHeight: '0px',
    maxWidth: 335,
    // fontSize: 40,
    // height: 'auto'
  },
  media: {
    width: '100%',
    // height: 300,
    borderRadius: '4px',
    position: 'relative',
    zIndex: 1000,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  addBook: {
    width: 'auto',
    maxWidth: 325,
    height: 'auto',
    textAlign: 'center',
  },
  cardImage: {
    margin: '0px',
    padding: '0px',
    width: '100%',
    outline: 'none',
    // height:'auto'
  },
  cardHeader: {
    fontSize: '12px',
  },
  button: {
    background: '#005792',
    borderRadius: '4px',
    color: '#FBFAF2',
    fontFamily: 'Rubik',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'none',
    '&:hover': {
      // background: '#B5CCEC',
      background: '#01204A',
    },
  },
})); */
// const PDFDocumentWrapper = styled.div`
//   canvas {
//     margin: auto;
//   }
// `;

// const options = {
//   paging: true,
//   search: true,
//   selection: false,
//   searchFieldAlignment: 'left',
//   searchFieldStyle: {
//     backgroundColor: '#FFFFFF',
//     // border: '1px solid #B5CCEC',
//     borderRadius: '2px',
//     fontFamily: 'Rubik',
//     fontWight: '400',
//     fontSize: '14px',
//     color: '#A4A9AF',
//     letterSpacing: '0px',
//   },
//   actionsColumnIndex: -1,

//   headerStyle: {
//     textAlign: 'center',
//     fontWeight: '500',
//     fontSize: 12,
//     color: '#707A85',
//     borderTop: '1px solid',
//     borderColor: '#E6EEF8',
//     // paddingLeft: 0,
//     // marginLeft: 0
//   },
//   cellStyle: {
//     textAlign: 'center',
//     fontWeight: '400',
//     fontSize: 16,
//     color: '#01204A',
//     borderColor: '#E6EEF8',
//   },
//   actionsCellStyle: {
//     display: 'flex',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   rowStyle: {
//     textAlign: 'center',
//     padding: 'auto',
//   },
// };
// const columns = [
//   {
//     title: 'PAGE NUMBER',
//     field: 'bookPageNumber',
//     editable: 'never',
//     maxWidth: '80px',
//   },
//   {
//     title: 'QUESTIONS',
//     field: 'questions',
//     editable: 'never',
//     maxWidth: '70px',
//   },
//   {
//     title: 'PAGE',
//     field: 'pdfUrl',
//     editable: 'never',
//     cellStyle: {
//       textAlign: 'center',
//       fontWeight: '500',
//       fontSize: 16,
//       color: '#01204A',
//       borderColor: '#E6EEF8',
//     },
//     headerStyle: {
//       textAlign: 'center',
//     },
//     render: (rowData) => (
//       <div>
//         <div
//           style={{
//             display: 'inline-block',
//             height: '300px',
//             lineHeight: '300px',
//             textAlign: 'center',
//           }}
//         >
//           <Document file={`${rowData.pdfUrl}`}>
//             <Page
//               height={300}
//               pageNumber={1}
//               loading={<Puff color='#00BFFF' height={100} width={100} />}
//             />
//           </Document>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: 'ACTION',
//     editable: 'never',
//     width: 'auto',
//     cellStyle: {
//       textAlign: 'center',
//     },
//     render: (rowData) => (
//       <>
//         <IconButton
//           aria-label='edit book'
//           className='icon__btn'
//           size='medium'
//           // disabled={rowData.added === true}
//           onClick={() => {
//             editAruco(rowData);
//           }}
//         >
//           <Edit style={{ fontSize: '22px' }} />
//         </IconButton>
//         <IconButton
//           aria-label='View Book'
//           className='icon__btn'
//           size='medium'
//           onClick={() => downloadBookPage(rowData)}
//         >
//           <GetApp style={{ fontSize: '22px' }} />
//         </IconButton>
//         <IconButton
//           aria-label='delete-metaData'
//           className='icon-btn'
//           size='medium'
//           disabled={rowData.used || rowData.questions === 0} //disabled if false
//           onClick={() => deleteMetadata(rowData.pageId)}
//         >
//           <DeleteOutline style={{ fontSize: '22px' }} />
//         </IconButton>
//       </>
//     ),
//   },
// ];
export const Resources = () => {
  const {
    isShowing,
    toggle,
    maxWidth,
    fullWidth,
    handleMaxWidthChange,
    handleFullWidthChange,
  } = useModal();
  const [state, setState] = useState({
    open: false,
    book: [],
    pageNumber: 1,
    data: [],
    bookPageError: false,
    downloadSuccess: false,
    downloadError: false,
    deleteSuccess: false,
  });

  const dispatch = useDispatch();
  const user = useSelector(currentUser);
  const book = useSelector(currentBook);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('resources page', user, book);
    document.title = 'Authoring Tool | Smart Pages';
    if (!('user' in localStorage || 'token' in localStorage)) {
      dispatch(setCurrentUser(null));
      navigate('/login');
    }
    if (typeof book === 'undefined') {
      navigate('/authoring/books');
    } else {
      // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
      getBookPages();
    }
  }, [book, user]);

  // 'https://prod.paperflowapp.com/authoring-no-aruco-book/splitPages/get'

  async function getBookPages() {
    await getSplitPagesApi(
      { bookId: book._id },
      { headers: { Authorization: user.token } }
    )
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          data: response.data.splitPages,
          book: book,
          author: user,
        }));
      })
      .catch((error) => {
        console.log({ error });
      });
  }
  //TODO PENDING - do not send state
  const editAruco = (rowData) => {
    console.log('rowData', rowData);
    navigate(`${rowData._id}`);
  };
  const downloadBookPage = (rowData) => {
    new JsFileDownloader({
      url: rowData.pdfUrl,
      filename: `${rowData.bookId}-${rowData.pageNumber}.pdf`,
    })
      .then(() => {
        setState((prevState) => ({ ...prevState, downloadSuccess: true }));
      })
      .catch((error) => {
        console.log({ error });
        setState((prevState) => ({ ...prevState, downloadError: true }));
      });
  };
  // "https://prod.paperflowapp.com/authoring-page-metadata/pagemetadata/delete"
  // const deleteMetadata = async (pageId) => {
  //   console.log('pageId', pageId);
  //   await axios
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/pageMetadata/delete`,
  //       {
  //         pageId: pageId,
  //       },
  //       {
  //         headers: {
  //           Authorization: user.token,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       console.log('res', res);
  //       setState((prevState) => ({
  //         ...prevState,
  //         deleteSuccess: true,
  //       }));
  //       getBookPages();
  //     })
  //     .catch((err) => {
  //       console.log('error', err);
  //     });
  // };

  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      bookPageError: false,
    }));
  };

  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      downloadSuccess: false,
    }));
  };

  const handleDownloadError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      downloadError: false,
    }));
  };

  const handleDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      deleteSuccess: false,
    }));
  };

  return (
    <>
      <BreadcrumbsItem to={`/authoring/books/${book._id}/resources`}>
        Smart Pages
      </BreadcrumbsItem>
      {/* <MaterialTable
        style={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'Searching for pages. . .',
            editRow: { deleteText: 'Are you sure you want to delete?' },
            fontSize: '14px',
          },
          toolbar: { searchPlaceholder: 'Search Book Pages' },
        }}
        options={options}
        title=''
        columns={state.columns}
        data={state.data}
      /> */}
      <Grid
        container
        spacing={2}
        direction='row'
        justifyContent='flex-start'
        alignItems='flex-start'
      >
        {!state.data.length && (
          <Grid
            item
            sx={{
              // border: '1px solid black',
              width: '100%',
              minHeight: '90vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Grid>
        )}

        {state.data.map((rowData, index) => (
          <Grid item key={index}>
            <Card>
              <Typography
                sx={{ textAlign: 'center', paddingTop: '5px', fontSize: 14 }}
              >
                Page Number: {rowData.pageNumber}
              </Typography>
              {/* <PDFDocumentWrapper> */}
              <CardActionArea
                onClick={() => editAruco(rowData)}
                // sx={{ px: '0.5rem' }}
              >
                {/* <Document file={`${rowData.pdfUrl}`}>
                  <Page
                    height={300}
                    pageNumber={1}
                    loading={<Puff color='#00BFFF' height={100} width={100} />}
                    style={{ 'canvas + &': { margin: 'auto' } }}
                  />
                </Document> */}
                <img
                  src={`${rowData.imageUrl}`}
                  alt='book pdf'
                  style={{ maxHeight: '18rem' }}
                />
              </CardActionArea>
              {/* </PDFDocumentWrapper> */}
              <CardActions sx={{ paddingBottom: 0 }}>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<Edit />}
                  sx={{ width: '100%' }}
                  onClick={() => editAruco(rowData)}
                >
                  Edit
                </Button>
              </CardActions>
              <CardActions
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ padding: '4px 5px 5px 0', fontSize: 12 }}>
                  {rowData.questions} Question(s)
                </Typography>
                <Button
                  startIcon={<GetApp />}
                  variant='outlined'
                  size='small'
                  onClick={() => downloadBookPage(rowData)}
                  sx={{ fontSize: 12 }}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {state.deleteSuccess && (
        <Snackbar
          open={state.deleteSuccess}
          autoHideDuration={4000}
          onClose={handleDelete}
        >
          <Alert
            variant='filled'
            elevation={6}
            severity='success'
            onClose={handleDelete}
          >
            Deleted Successfully
          </Alert>
        </Snackbar>
      )}
      {state.bookPageError && (
        <Snackbar
          open={state.bookPageError}
          autoHideDuration={4000}
          onClose={handleError}
        >
          <Alert
            variant='filled'
            elevation={6}
            onClose={handleError}
            severity='error'
          >
            <Typography className='bookDeleteError'>
              Could not delete book, Try again!
            </Typography>
          </Alert>
        </Snackbar>
      )}

      {state.downloadSuccess && (
        <Snackbar
          open={state.downloadSuccess}
          autoHideDuration={4000}
          onClose={handleSuccess}
        >
          <Alert
            variant='filled'
            elevation={6}
            severity='success'
            onClose={handleSuccess}
          >
            PDF Successfully Downloaded
          </Alert>
        </Snackbar>
      )}
      {state.downloadError && (
        <Snackbar
          open={state.downloadError}
          autoHideDuration={4000}
          onClose={handleDownloadError}
        >
          <Alert
            variant='filled'
            elevation={6}
            severity='error'
            onClose={handleDownloadError}
          >
            Could Not Download, Try Again!
          </Alert>
        </Snackbar>
      )}
      <AddPage
        isShowing={isShowing}
        hide={toggle}
        maxWidth={maxWidth}
        handleFullWidthChange={handleFullWidthChange}
        handleMaxWidthChange={handleMaxWidthChange}
        fullWidth={fullWidth}
        user={user}
        book={book}
      />
    </>
  );
};

export { Resources as default } from './Resources';
