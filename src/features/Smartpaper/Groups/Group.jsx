/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowBack,
  Assessment,
  DocumentScanner,
  ExpandMore,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { EditGroupDialog } from './GroupDialogBox';
import { currentUser } from '../../auth/userSlice';
import { getGroupDetailsApi, updateGroupApi } from '../../../api/groupApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';
import Loader from '../../../elements/Loader';

export const Group = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [testList, setTestList] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [editDialog, setEditDialog] = useState(false);

  const user = useSelector(currentUser);
  const { token } = user;
  let { classId } = useParams();
  const [inputs, setInputs] = useState({
    name: '',
    totalStudents: 0,
    type: 'class',
    groupId: classId,
  });
  const [state, setState] = useState({
    loading: false,
    listLoading: true,
    error: false,
    success: false,
    message: '',
  });
  const getGroupDetails = async () => {
    setState({
      ...state,
      listLoading: true,
      success: false,
      message: '',
    });

    try {
      const res = await getGroupDetailsApi(
        { groupId: classId },
        { headers: { authorization: token } }
      );
      console.log('res', res);
      setTestList(res.data.targets);
      setGroupDetails(res.data.group);
      setState({
        ...state,
        listLoading: false,
        success: false,
        message: '',
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getGroupDetails();
    return () => {};
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleEditGroup = () => {
    setEditDialog(true);
  };

  const handleScan = (e) => {
    e.preventDefault();
    navigate('scan');
  };

  const handleResult = (e) => {
    navigate('result');
  };

  const updateGroup = async () => {
    setState({
      ...state,
      loading: true,
      success: false,
      message: '',
    });
    try {
      const res = await updateGroupApi(inputs, {
        headers: { Authorization: token },
      });
      res &&
        setState({
          ...state,
          success: true,
          error: false,
          loading: false,
          message: 'Class updated!',
        });
      setTimeout(() => {
        setState({ ...state, success: false, message: '' });
        res && setEditDialog(false);
        setInputs({
          name: '',
          totalStudents: 0,
          groupId: classId,
        });
        getGroupDetails();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  const editDialogClose = () => {
    setEditDialog(false);
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
      {state.listLoading && <Loader loadingMessage={'Loading...'} />}
      <Box
        component='main'
        // maxWidth="xs"
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            minHeight: '95vh',
            padding: '2rem 0',
          }}
          width={{ xs: '90%', sm: '90%', md: '80%' }}
          maxWidth='50rem'
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <IconButton
              color='primary'
              aria-label='go-back'
              component='span'
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBack
                color='primary'
                sx={{ padding: 0, color: '#0d47a1' }}
              />
            </IconButton>
            <Typography
              variant='h5'
              sx={{ margin: 'auto', paddingLeft: '3rem' }}
              // sx={{ textAlign: 'center', width: '100%', margin: 'auto' }}
            >
              {groupDetails.name}
            </Typography>
            <Button
              variant='contained'
              // startIcon={
              //   <Edit sx={{ transform: 'scale(0.8)', margin: 0, padding: 0 }} />
              // }
              sx={{
                margin: 0,
                padding: 0,
                width: { xs: '4.9rem', sm: '6rem' },
                textTransform: 'none',
                borderRadius: '0.5rem',
                backgroundColor: '#0d47a1',
                fontSize: '13px',
              }}
              onClick={() => handleEditGroup()}
            >
              Edit Class
            </Button>
          </Box>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px',
              gap: { xs: '2rem', md: '4rem' },
              ml: 'auto',
              mr: 'auto',
            }}
          >
            <Button
              variant='contained'
              // disabled={!(text.length > 0)}
              sx={{
                width: { md: '140px' },
                height: { md: '120px' },
                fontSize: '1rem',
                textTransform: 'none',
                alignSelf: 'center',
                borderRadius: '0.5rem',
                backgroundColor: '#0d47a1',
                mt: 2,
                flexDirection: 'column',
              }}
              onClick={handleScan}
            >
              <DocumentScanner sx={{ fontSize: '45px', margin: '10px' }} />
              Scan
            </Button>
            <Button
              variant='contained'
              // disabled={!(text.length > 0)}
              sx={{
                width: { md: '140px' },
                height: { md: '120px' },
                fontSize: '1rem',
                textTransform: 'none',
                alignSelf: 'center',
                borderRadius: '0.5rem',
                backgroundColor: '#0d47a1',
                mt: 2,
                flexDirection: 'column',
              }}
              onClick={handleResult}
            >
              <Assessment sx={{ fontSize: '45px', margin: '10px' }} />
              Results
            </Button>
          </Box>
          {testList.map((test, index) => (
            <Accordion
              expanded={expanded === index}
              onChange={handleChange(index)}
              key={index}
              // sx={{ backgroundColor: '#f7f7f7' }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
                sx={{
                  backgroundColor: '#f7f7f7',
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontSize: '15px' }}>
                  {test.targetName} - {test.totalScans} scans
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  variant='outlined'
                  sx={{
                    fontSize: { xs: '0.75rem', md: '1rem' },
                    margin: { xs: '0.75rem', md: '0.5rem' },
                  }}
                >
                  <Link
                    to={`${test.targetName}/scan`}
                    style={{ textDecoration: 'none' }}
                  >
                    Add Scans
                  </Link>
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    fontSize: { xs: '0.75rem', md: '1rem' },
                    margin: { xs: '0.75rem', md: '0.5rem' },
                  }}
                >
                  <Link
                    to={`${test.targetName}/result`}
                    style={{ textDecoration: 'none' }}
                  >
                    View Results
                  </Link>
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
          <EditGroupDialog
            open={editDialog}
            handleClose={editDialogClose}
            handleClick={updateGroup}
            loading={state.loading}
            inputs={inputs}
            setInputs={setInputs}
          />
        </Box>
      </Box>
      {state.error && <CustomErrorTemplate message={state.message} />}
      {state.success && <CustomSuccessTemplate message={state.message} />}
    </Container>
  );
};
