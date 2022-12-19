/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { NewGroupDialog } from './GroupDialogBox';
import { currentUser } from '../../auth/userSlice';
import { createGroupApi, deleteGroupsApi, getAllGroupsApi } from '../../../api/groupApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';
import Loader from '../../../elements/Loader';

export const Groups = () => {
  const user = useSelector(currentUser);
  const [groupDialogState, setGroupDialogState] = useState(false);
  const [groupListSample, setGroupListSample] = useState([]);
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: false,
    listLoading: true,
    error: false,
    success: false,
    message: '',
  });
  const { organizationId, token } = user;
  const [inputs, setInputs]=useState({
    name:'',
    totalStudents:0,
    type:'class',
    organizationId:organizationId,
  })
  const getGroups = async () => {
    setState({
      ...state,
      listLoading: true,
      success: false,
      message: '',
    });
    try {
      const res = await getAllGroupsApi(
        { organizationId: organizationId },
        { headers: { authorization: token } }
      );
      setGroupListSample(res.data.groups);
      setState({
        ...state,
        listLoading: false,
        success: false,
        message: '',
      });
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        listLoading: false,
        error: true,
        message: 'Something went wrong!',
      });
      setTimeout(() => {
        setState({ ...state, error: false, success: false, message: '' });
      }, 3000);
    }
  };
  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoute = (group) => {
    navigate(group._id);
  };
  const deleteGroup = async (id) =>{
    const groupIds = [id]
    setState({
      ...state,
      loading: true,
      success: false,
      message: '',
    });
    try {
      const res = await deleteGroupsApi(
        {
         groupIds:groupIds
        },
        { headers: { Authorization: user.token } }
      );
      res &&
        setState({
          ...state,
          success: true,
          error: false,
          loading: false,
          message: 'Class deleted!',
        });
      setTimeout(() => {
        setState({ ...state, success: false, message: '' });
        getGroups();
      }, 1000);
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
  }
  const createGroup = async () => {
    
    setState({
      ...state,
      loading: true,
      success: false,
      message: '',
    });
    try {
      const res = await createGroupApi(
       inputs,
        { headers: { Authorization: user.token } }
      );
      res &&
        setState({
          ...state,
          success: true,
          error: false,
          loading: false,
          message: 'Class added!',
        });
      res && setGroupListSample([...groupListSample, res.data]);
      setTimeout(() => {
        setState({ ...state, success: false, message: '' });
        res && setGroupDialogState(false);
        setInputs({
          name:'',
          totalStudents:0,
          type:'class',
          organizationId:organizationId,
        })
        getGroups();
      }, 1000);
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

  const groupDialogClose = () => {
    setGroupDialogState(false);
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
        component="main"
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
          maxWidth="50rem"
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
              mt: 1,
            }}
          >
            <Typography variant="h3">Classes</Typography>
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
              onClick={() => setGroupDialogState(true)}
            >
              New Class
            </Button>
          </Box>
          {!groupListSample.length && (
            <Typography sx={{ fontSize: '15px', mt: 4, textAlign: 'center' }}>
              Click on New Class to add a class
            </Typography>
          )}
          {!!groupListSample.length &&
            groupListSample.map((group, index) => (
              <Card key={index} sx={{ mb: 2, display:'flex', justifyContent:'space-between' }}>
                <CardActionArea
                  onClick={() => {
                    handleRoute(group);
                  }}
                >
                  <CardContent >
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: '18px' }}
                      >
                        {group.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: '16px' }}
                      >
                        {group.totalStudents} students
                      </Typography>
                  </CardContent>
                </CardActionArea>
                <Divider orientation='vertical' flexItem/>
                    <IconButton onClick={(e )=>{
                        deleteGroup(group._id)}} disabled={state.loading} sx={{height:'100%', margin:'auto 0.25rem'}}>
                        <Delete />
                      </IconButton>
                      
              </Card>
            ))}
        </Box>
        <NewGroupDialog
          open={groupDialogState}
          handleClick={createGroup}
          handleClose={groupDialogClose}
          loading={state.loading}
          inputs={inputs}
          setInputs={setInputs}
        />
      </Box>
      {state.error && <CustomErrorTemplate message={state.message} />}
      {state.success && <CustomSuccessTemplate message={state.message} />}
    </Container>
  );
};
