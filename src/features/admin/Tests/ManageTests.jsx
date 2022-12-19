// import { Add } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
import { getAllTests } from '../../../api/authoringApi';

const ManageTests = () => {
  const user = useSelector(currentUser);
  const [state, setState] = useState({
    listLoading: false,
    testsListEmpty: true,
    loading: false,
    error: false,
    success: false,
    message: '',
    testsList: [],
  });
  const getTests = async () => {
    setState({
      ...state,
      listLoading: true,
      testsListEmpty: true,
      success: false,
      message: '',
      testsList:[]
    });

    const { organizationId } = user;
    await  getAllTests({
      body: { organizationId: organizationId },
      headers: { headers: { Authorization: user.token } },
    }).then((res) => {
      const { tests } = res.data;
      if(tests.length>0){
        setState((prevState) => ({
          ...prevState,
          testsList: tests,
          listLoading: false,
          testsListEmpty: false,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          message: 'No tests found!',
          listLoading: false,
          testsListEmpty: true,
        }));
      }
    })
    .catch((err) => {
      console.log({ err });
      setState((prevState) => ({
        ...prevState,
        message: 'No tests found!',
        listLoading: false,
        success: false,
        error: true,
        testsListEmpty: true,
      }));
      setTimeout(() => {
        setState({ ...state, error: false, success: false, message: '' });
      }, 3000);
    });
  }
   
         
  useEffect(() => {
    getTests();
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
      >{' '}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          mt: 1,
        }}
      >
        <Typography variant="h3">Tests</Typography>
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
          New Test
        </Button> */}
      </Box>
      {state.listLoading ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>
          <CircularProgress /></Box>
        ) : (
          <>
            {state.testsListEmpty ? (
          <Box sx={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', pt:'2rem'}}>

              <Typography>{state.message}</Typography>
              </Box>
            ) : (
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell >Book name</TableCell>
            <TableCell>Test Name</TableCell>
            <TableCell >Total Questions</TableCell>
            <TableCell >Test type</TableCell>
            <TableCell >Data Export format</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.testsList.map((test) => (
            <TableRow
              key={test.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >{test.bookName}</TableCell>
              <TableCell component="th" scope="row">
                {test.testName}
              </TableCell>
              <TableCell>{test.totalQuestions}</TableCell>
              <TableCell>{test.testType}</TableCell>
              <TableCell>{test.dataExportFormat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
     )} 
     </>
   )}
      </Box>
    </Container>
  );
};

export default ManageTests;
