import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
import { getAllBooksApi } from '../../../api/authoringApi';
const ManageBooks = () => {
  const user = useSelector(currentUser);
  const [state, setState] = useState({
    listLoading: false,
    booksListEmpty: true,
    loading: false,
    error: false,
    success: false,
    message: '',
    booksList: [],
  });
  const getBooks = async () => {
    setState({
      ...state,
      listLoading: true,
      booksListEmpty: true,
      success: false,
      message: '',
      booksList:[]
    });
    const { organizationId } = user;
    await getAllBooksApi(
      { organizationId: organizationId },
      { headers: { Authorization: user.token } }
    )
      .then((response) => {
        const { books } = response.data;
        if (books.length > 0) {
          setState((prevState) => ({
            ...prevState,
            booksList: books,
            listLoading: false,
            booksListEmpty: false,
          }));
        }
        else{
          setState((prevState) => ({
            ...prevState,
            message: 'No books found!',
            listLoading: false,
            booksListEmpty: true,
          }));
        }
      })
      .catch((err) => {
        console.log({ err });
        setState((prevState) => ({
          ...prevState,
          message: 'No books found!',
          listLoading: false,
          success: false,
          error: true,
          booksListEmpty: true,
        }));
        setTimeout(() => {
          setState({ ...state, error: false, success: false, message: '' });
        }, 3000);
      });
  };
  useEffect(() => {
    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          minHeight: '95vh',
          padding: '2rem 0',
        }}
        width={{ xs: '90%', sm: '90%', md: '80%' }}
        //   maxWidth="50rem"
      >
        {' '}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            mt: 1,
          }}
        >
          <Typography variant="h3">Books</Typography>
          {/* <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          height: 'fit-content',
          textTransform: 'none',
          borderRadius: '0.5rem',
          backgroundColor: '#0d47a1',
          fontSize: '15px',
        }}
      >
        New Book
      </Button> */}
        </Box>
        {state.listLoading ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>
          <CircularProgress /></Box>
        ) : (
          <>
            {state.booksListEmpty ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>

              <Typography>{state.message}</Typography>
              </Box>
            ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Book Name</TableCell>
                <TableCell>Total Pages</TableCell>
                <TableCell>Book type</TableCell>
                <TableCell>Publisher</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.booksList.map((book) => (
                <TableRow
                  key={book.bookName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" >
                    <div style={{display:"flex",  alignItems:'center', gap:'0.5rem'}}>
                  <img
                      src={book.thumbnail}
                      alt={book.bookName}
                      style={{ width: '2.5rem' }}
                    />
                    <p> {book.bookName}</p></div>
                  </TableCell>
                  <TableCell>{book.totalPages}</TableCell>
                  <TableCell >{book.bookType}</TableCell>
                  <TableCell >{book.publisher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}</>)}
      </Box>
    </Container>
  );
};

export default ManageBooks;
