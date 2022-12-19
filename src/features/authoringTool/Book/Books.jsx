/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Delete, Edit, Settings } from '@mui/icons-material';
import {
  Alert,
  Button,
  IconButton,
  LinearProgress,
  Link,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { format, parseISO } from 'date-fns';
import MaterialTable from 'material-table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setCurrentBook } from './BookSlice';
import { currentUser } from '../../auth/userSlice';
import {
  deleteBookApi,
  getAllBooksApi,
  getAllTests,
} from '../../../api/authoringApi';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';

export const Books = () => {
  const MAXAPICALL = 10;
  const [state, setState] = useState({
    books: [],
    user: null,
    data: [],
    apiCall: 0,
    bookError: false,
    tableMessage: 'Searching for books...',
  });

  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteBook = (book) => {
    const bookName = book.bookName;
    const enteredName = window.prompt(`Please type ${bookName} to confirm.`);
    if (enteredName === book.bookName) {
      // console.log('delete book');
      deleteBookApi(
        { bookId: book._id },
        { headers: { Authorization: user.token } }
      )
        .then(async () => {
          setState((prevState) => ({
            ...prevState,
            bookDeleteSuccess: true,
          }));
          getBooks(user.token);
        })
        .catch((err) => {
          console.log('book delete error', err);
        });
    } else {
      // window.alert('Could not delete book try again!');
      setState((prevState) => ({ ...prevState, bookError: true }));
    }
  };

  useEffect(() => {
    // console.log('getting useeffect user', user.currentUser);
    document.title = 'Authoring Tool | Books';
    dispatch(setCurrentBook(null));
    state.user === null &&
      setState((prevState) => ({
        ...prevState,
        user: user,
      }));
    state.user && getBooks(user.token);
  }, [state.user]);

  const getBooks = async (token) => {
    try {
      // const allBookRes = await getAllBooksApi(
      //   { organizationId: user.organizationId },
      //   { headers: { Authorization: token } }
      // );
      // const testRes = await getAllTests({
      //   body: { organizationId: user.organizationId },
      //   headers: { headers: { Authorization: user.token } },
      // });
      // const { tests } = testRes.data;
      // const { books } = allBookRes.data;
      const [sampleBooks, sampleTests] = await Promise.all([
        getAllBooksApi(
          { organizationId: user.organizationId },
          { headers: { Authorization: token } }
        ),
        getAllTests({
          body: { organizationId: user.organizationId },
          headers: { headers: { Authorization: user.token } },
        }),
      ]);
      // console.log('first', sampleTests.data.books, sampleBooks.data);
      const { targets } = sampleTests.data;
      const { books } = sampleBooks.data;
      // console.log('books', books);
      books.forEach((bookItem) => {
        bookItem.testCount = 0;
        targets.forEach((testItem) => {
          if (testItem.bookId === bookItem._id) {
            bookItem.testCount += 1;
          }
        });
      });
      if (books.length === 0) {
        setState((prevState) => ({
          ...prevState,
          tableMessage: 'No books found, please add a new book!',
        }));
      }
      if (books.length > 0) {
        // console.log('books', books);
        if (
          books.some((item) => item.status === 'processing') &&
          state.apiCall <= MAXAPICALL //do not make requests if more than MAXAPICALL requests
        ) {
          // console.log('api call', state.apiCall);
          let timer = 2000;
          const book = books.find((item) => item.status === 'processing');
          if (book.totalPages >= 10) timer = 1000;
          setState((pre) => ({ ...pre, apiCall: state.apiCall++ }));
          setTimeout(() => {
            getBooks(user.token);
          }, timer);
        }
        setState((prevState) => ({ ...prevState, data: books.reverse() }));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const addNewBook = () => {
    navigate('add');
  };

  const editBook = (rowData) => {
    const { tableData: _, ...all } = rowData;
    dispatch(setCurrentBook(all));
    navigate(`${all._id}/edit`);
  };

  const viewBook = (e, rowData) => {
    e.preventDefault();
    const { tableData: _, ...all } = rowData;
    // console.log(all);
    dispatch(setCurrentBook(all));
    navigate(`${all._id}`);
  };

  const handleError = (e, reason) => {
    if (reason === 'clickaway') return;
    setState((prevState) => ({ ...prevState, bookError: false }));
  };

  //matrial table properties
  let columns = [
    {
      title: 'BOOK NAME',
      field: 'bookName',
      editable: 'onUpdate',
      cellStyle: {
        textAlign: 'left',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
      },
      headerStyle: { textAlign: 'center', paddingLeft: '2rem' },
      render: (rowData) => (
        <div>
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: '10px',
            }}
          >
            <img
              src={rowData.thumbnail}
              alt={rowData.bookName}
              style={{ width: 35, height: 35 }}
            />
          </div>
          <Link
            style={{
              display: 'inline-block',
              // height: '60px',
              lineHeight: '35px',
              textAlign: 'center',
              margin: '2px auto auto 16px',
              cursor: 'pointer',
              color: '#01204A',
              // color: '#0a1675',
              pointerEvents: rowData.status === 'processing' ? 'none' : 'auto',
            }}
            rel='noopener noreferrer'
            underline='hover'
            onClick={(e) => viewBook(e, rowData)}
          >
            {rowData.bookName}
          </Link>
        </div>
      ),
    },
    {
      title: 'STATUS',
      field: 'status',
      headerStyle: { textAlign: 'left' },
      cellStyle: { textAlign: 'left', padding: '0' },
      render: (rowData) => (
        <Box position='relative'>
          {rowData.status === 'processing' ? (
            <Box
              // display='flex'
              // justifyContent='center'
              // alignItems='center'
              // mr={3.3}
              width='100%'
            >
              <Typography position='relative'>Processing</Typography>
              <LinearProgress color='secondary' sx={{ width: '4.9rem' }} />
            </Box>
          ) : (
            <div className=''>Processed</div>
            // <p>{rowData.status}</p>
          )}
        </Box>
      ),
    },
    {
      title: 'PAGES',
      field: 'totalPages',
      headerStyle: { textAlign: 'left' },
      cellStyle: { textAlign: 'left', padding: '1.5rem' },
    },
    {
      title: 'TESTS',
      field: 'testCount',
      headerStyle: { textAlign: 'left', paddingRight: 0 },
      cellStyle: { textAlign: 'left', padding: '1.5rem 0 1.5rem 1.5rem' },
    },
    {
      title: 'CREATED ON',
      field: 'createdAt',
      headerStyle: { maxWidth: '1rem', paddingLeft: '1rem', paddingRight: 0 },
      cellStyle: { textAlign: 'center' },
      render: (rowData) => {
        const date = format(parseISO(rowData.createdAt), 'do MMM, yy');
        return <p>{date}</p>;
      },
    },
    {
      title: 'ACTION',
      editable: 'never',
      width: 'auto',
      cellStyle: {
        textAlign: 'center',
      },
      render: (rowData) => (
        <>
          <Tooltip title='Edit Book'>
            <IconButton
              aria-label='Edit Book'
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              onClick={(e) => {
                viewBook(e, rowData);
              }}
            >
              <Edit style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Book Settings'>
            <IconButton
              aria-label='Book Settings'
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              // disabled={rowData.status === 'Processing'}
              onClick={() => {
                editBook(rowData);
              }}
            >
              <Settings style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete Book'>
            <IconButton
              aria-label='Delete Book'
              // disabled={rowData.status === 'Processing'}
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              onClick={() => {
                deleteBook(rowData);
              }}
            >
              <Delete style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  const options = {
    paging: true,
    pageSize: 10,
    search: true,
    selection: false,
    searchFieldAlignment: 'left',
    searchFieldStyle: {
      backgroundColor: '#FFFFFF',
      // border: '1px solid #B5CCEC',
      borderRadius: '2px',
      fontFamily: 'Rubik',
      fontWight: '400',
      fontSize: '14px',
      color: '#A4A9AF',
      letterSpacing: '0px',
    },
    actionsColumnIndex: -1,

    headerStyle: {
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 12,
      color: '#707A85',
      borderTop: '1px solid',
      borderColor: '#E6EEF8',
      // paddingLeft: 0,
      // marginLeft: 0
    },
    cellStyle: {
      textAlign: 'center',
      fontWeight: '400',
      fontSize: 16,
      color: '#01204A',
      borderColor: '#E6EEF8',
    },
    actionsCellStyle: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    rowStyle: {
      textAlign: 'center',
      padding: 'auto',
    },
  };

  const dataTable = useMemo(() => state.data, [state.data]);
  return (
    <>
      {/* <Button onClick={() => console.log('log', state.data, 'book', newBook)}>
        Log
      </Button> */}
      <MaterialTable
        style={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        localization={{
          body: {
            emptyDataSourceMessage: `${state.tableMessage}`,
            editRow: { deleteText: 'Are you sure you want to delete?' },
            fontSize: '14px',
          },
          toolbar: { searchPlaceholder: 'Search Books' },
        }}
        options={options}
        title=''
        columns={columns}
        data={dataTable}
        actions={state.actions}
        components={{
          Actions: () => (
            <Tooltip title='Add New Book'>
              <Button
                onClick={(event) => addNewBook(event)}
                variant='contained'
                color='secondary'
                startIcon={<Add />}
                size='small'
              >
                Add Book
              </Button>
            </Tooltip>
          ),
        }}
      />
      {state.bookDeleteSuccess && (
        <CustomSuccessTemplate message='Book deleted succesfully!' />
      )}
      {state.bookError && (
        <Snackbar
          open={state.bookError}
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
    </>
  );
};
