import { Add, Delete } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AddAuthorModal from './AddAuthorModal';
import { currentUser } from '../../auth/userSlice';
import { deleteUserApi, getAllUsersByTypeApi } from '../../../api/adminApi';
import { signup } from '../../../api/authApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';

const ManageAuthors = () => {
  const user = useSelector(currentUser);
  const [addAuthorModal, setAddAuthorModal] = useState(false);

  const [state, setState] = useState({
    listLoading: false,
    listEmpty: true,
    loading: false,
    error: false,
    success: false,
    message: '',
    usersList: [],
  });
 
  const getUsers = async () => {
    setState({
      ...state,
      listLoading: true,
      userListEmpty: true,
      success: false,
      message: '',
      usersList: [],
    });
    const { organizationId } = user;
    await getAllUsersByTypeApi(
      { organizationId: organizationId, userType: 'author' },
      { headers: { Authorization: user.token } }
    )
      .then((response) => {
        const { users } = response.data;
        if (users.length > 0) {
          setState((prevState) => ({
            ...prevState,
            usersList: users,
            listLoading: false,
            userListEmpty: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            message: 'No users found!',
            listLoading: false,
            userListEmpty: true,
          }));
        }
      })
      .catch((err) => {
        console.log({ err });
        setState((prevState) => ({
          ...prevState,
          message: 'No users found!',
          listLoading: false,
          success: false,
          error: true,
          userListEmpty: true,
        }));
        setTimeout(() => {
          setState({ ...state, error: false, success: false, message: '' });
        }, 3000);
      });
  };
  const handleDelete = async (userId) => {
    setState({ ...state, loading: true, success: false, message:'' });
      try {
        const res = await deleteUserApi(
          { userIds: [userId] },
      { headers: { authorization: user.token } }
        );
        res &&
          setState({
            ...state,
            success: true,
            error: false,
            loading: true,
            listLoading:true,
            message: 'User deleted!',
          });
          // getUsers();
      window.location.reload(false)
        // setTimeout(() => {
        //   setState({ ...state, success: false, message: '' });
        
        // }, 1000);
      } catch (e) {
        setState({
          ...state,
          loading: false,
          success: false,
          error: true,
          message: e.response.data.message,
        });
        setTimeout(() => {
          setState({ ...state, error: false, message: '' });
        }, 5000);
        console.log(e);
      }
  };
  const handleClose = () => {
    setAddAuthorModal(false);
  };
  const handleAddAuthor = async (inputs) => {
    setState({ ...state, loading: true, success: false, message:'' });
    try {
      const res = await signup(
        inputs
      );
      res &&
      setState({
        ...state,
        success: true,
        error: false,
        loading: false,
        isLoggedIn: true,
        message: 'Author Added',
      });
      handleClose()
      setState({ ...state, success: false, message: '' });
      // getUsers();
      window.location.reload(false)
      // setTimeout(() => {  
      //   setState({ ...state, success: false, message: '' });
      // }, 1000);
    } catch (e) {
      setState({
        ...state,
        loading: false,
        success: false,
        error: true,
        message: e.response.data.message,
      });
      setTimeout(() => {
        setState({ ...state, error: false, message: '' });
      }, 5000);
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
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
          <Typography variant="h3">Authors</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              height: 'fit-content',
              textTransform: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#0d47a1',
              fontSize: '15px',
            }}
            onClick={() => setAddAuthorModal(true)}
          >
            Add Author
          </Button>
        </Box>
        {addAuthorModal && (
          <AddAuthorModal
            handleClose={handleClose}
            handleAddAuthor={handleAddAuthor}
            loading={state.loading}
          />
        )}
        {state.listLoading ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pt: '2rem',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {state.userListEmpty ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: '2rem',
                }}
              >
                <Typography>{state.message}</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell> Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.usersList && state.usersList.map((user) => (
                      <TableRow
                        key={user.username}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.language}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDelete(user._id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
      {state.error && <CustomErrorTemplate message={state.message} />}
      {state.success && <CustomSuccessTemplate message={state.message} />}
    </Container>
  );
};

export default ManageAuthors;
