import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
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
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AddTeacherModal from './AddTeacherModal';
import { currentUser } from '../../auth/userSlice';
import { deleteUserApi, getAllUsersByTypeApi } from '../../../api/adminApi';
import { loginWithoutOtpApi } from '../../../api/authApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';

const ManageTeachers = () => {
  const user = useSelector(currentUser);
  const [addTeacherModal, setAddTeacherModal] = useState(false);
  const handleClose = () => {
    setAddTeacherModal(false);
  };
  const [state, setState] = useState({
    listLoading: false,
    userListEmpty: true,
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
      usersList:[]
    });

    const { organizationId } = user;
    await getAllUsersByTypeApi(
      { organizationId: organizationId, userType: 'teacher' },
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
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      window.location.reload(false)
        //   getUsers();
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
  const handleAddTeacher = async (phoneNumber, inviteCode) => {
    setState({ ...state, loading: true, success: false });
    console.log(phoneNumber);
    const newPhone = phoneNumber.split(' ').join('');
    const tempObj = {
      mobile: newPhone,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      inviteCode:inviteCode
    };
    try {
      const res = await loginWithoutOtpApi(tempObj);
      console.log(res)
      setState({
        ...state,
        success: true,
        error: false,
        loading: false,
        message: 'Success!',
      });
      handleClose();
      // getUsers();
      window.location.reload(false)

      // stepNum === 0 && res && setStepNum(1);
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        loading: false,
        success: false,
        error: true,
        // message: err.response.data.message,
      });
      setTimeout(() => {
        setState({ ...state, error: false, success: false, message: '' });
      }, 3000);
    }
  };
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
          <Typography variant="h3">Teachers</Typography>
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
            onClick={() => setAddTeacherModal(true)}
          >
            Add Teacher
          </Button>
        </Box>
        {addTeacherModal && (
          <AddTeacherModal
            handleClose={handleClose}
            handleAddTeacher={handleAddTeacher}
            loading={state.loading}
          />
        )}
        {state.listLoading ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>
          <CircularProgress /></Box>
        ) : (
          <>
            {state.userListEmpty ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>

              <Typography>{state.message}</Typography>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
              >
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Action</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.usersList && state.usersList.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{user.language}</TableCell>
                        <TableCell>{user.organizationName}</TableCell>
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
      {state.success && <CustomSuccessTemplate message={state.message} />}
      {state.error && <CustomErrorTemplate message={state.message} />}
    </Container>
  );
};

export default ManageTeachers;
