/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Grid, Paper, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser, setCurrentUser } from '../../auth/userSlice';
import { updateTeacherApi } from '../../../api/authApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(setCurrentUser(null));
//     dispatch(setCurrentBook(null));
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <Container
//       sx={{
//         // marginTop: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//       }}
//     >
//       <Button
//         variant='contained'
//         endIcon={<Logout />}
//         onClick={handleLogout}
//         sx={{ fontSize: 16, margin: 'auto', backgroundColor: '#0d47a1' }}
//       >
//         Logout
//       </Button>
//     </Container>
//   );
// };

// export default Profile;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: '2rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    margin: 'auto',
    // minWidth: 500,
    width: 'auto',
    // maxWidth: 500,
    borderRadius: '10px',
    flexGrow: 1,
  },
}));

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(currentUser);
  const navigate = useNavigate();

  const [state, setState] = useState({
    name: '',
    email: '',
    organizationName: '',
    changedFields: [],
    user: null,
    userId: '',
    updateError: false,
    updateSuccess: false,
    updateErrorMessage: '',
    updateSuccessMessage: '',
    reload: false,
  });

  useEffect(() => {
    // getUserDetails();
    if (user === null || user === undefined) {
      navigate('/login');
    } else {
      setState((prevState) => ({
        ...prevState,
        user: user,
        mobile: user.mobile,
        organizationName: user.organizationName,
        userId: user.id || '',
        name: user.name || '',
        email: user.email || '',
        changedFields: [],
      }));
    }
    // console.log('state', state);
  }, [user]);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.clear();
    navigate('/login');
  };

  const updateFields = (e) => {
    if (
      e.target.value !== state.user[e.target.name] &&
      state.changedFields.indexOf(e.target.name) === -1
    ) {
      setState((prevState) => ({
        ...prevState,
        changedFields: [...state.changedFields, e.target.name],
      }));
    } else if (e.target.value === state.user[e.target.name]) {
      setState((prevState) => ({
        ...prevState,
        changedFields: state.changedFields.filter(
          (field) => field !== e.target.name
        ),
      }));
    }
  };

  const updateProfile = async () => {
    let updateObj = {};
    for (const field of state.changedFields) {
      updateObj[field] = state[field];
    }
    // 'https://prod.paperflowapp.com/user/updateProfile'

    await updateTeacherApi(
      {
        userId: user._id,
        organizationId: user.organizationId,
        username: state.name,
        email: state.email,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then((res) => {
        const { user } = res.data;
        dispatch(setCurrentUser(user));
        setState((prevState) => ({
          ...prevState,
          user: user,
          name: user.name,
          email: user.email,
          organization: user.organization,
          userId: user._id,
          changedFields: [],
          updateSuccess: true,
          updateError: false,
          updateSuccessMessage: 'Profile updated successfully',
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            updateSuccess: false,
            updateSuccessMessage: '',
          }));
        }, 4000);
      })
      .catch((err) => {
        console.log('err', err);
        setState((prevState) => ({
          ...prevState,
          updateError: true,
          updateErrorMessage: err.response.data.message.message,
          name: state.user.name,
          organization: state.user.organization,
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            updateError: false,
            updateErrorMessage: '',
          }));
        }, 4000);
      });
  };
  // 'https://dev.smartpaperapp.com/smart-user/get'

  const classes = useStyles();
  return (
    <>
      {/* <BreadcrumbsItem to='/home/myProfile'>My Profile</BreadcrumbsItem> */}
      {/* <button onClick={() => console.log('user', user)}>log</button> */}
      <Paper
        className={classes.paper}
        elevation={1}
        variant='elevation'
        square
        sx={{
          boxShadow: { xs: 'none', sm: '1px 1px #dadada' },
          border: { sm: '1px solid #dadada' },
          maxWidth: { xs: 'none', sm: 500 },
        }}
      >
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={3}
        >
          <Grid item xs>
            <Avatar alt={state.name} sx={{ width: 64, height: 64 }} />
          </Grid>
          <Grid item xs>
            <TextField
              style={{ width: '300px' }}
              size='medium'
              id='number'
              name='number'
              value={user.mobile}
              label='Number'
              inputProps={{ readOnly: true }}
            />
            {/* <Typography sx={{ textAlign: 'left' }}>
              Mobile: {state.mobile}
            </Typography> */}
          </Grid>
          <Grid item xs sx={{ paddingTop: '10px' }}>
            <TextField
              style={{ width: '300px' }}
              size='medium'
              type='text'
              id='organization'
              name='organizationName'
              value={state.organizationName}
              label='Organization'
              inputProps={{ readOnly: true }}
            />
            {/* <Typography>Organization: {state.organizationName}</Typography> */}
          </Grid>

          <Grid item xs>
            <TextField
              style={{ width: '300px' }}
              size='medium'
              type='text'
              id='name'
              name='name'
              value={state.name}
              label='Name'
              onBlur={updateFields}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs>
            <TextField
              style={{ width: '300px' }}
              margin='normal'
              size='medium'
              type='email'
              id='email'
              name='email'
              value={state.email}
              label='e-mail'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs>
            <Button
              disabled={!state.changedFields.length}
              width='auto'
              variant='contained'
              color='primary'
              className='submitButton'
              onClick={() => updateProfile()}
              sx={{ backgroundColor: '#0d47a1' }}
            >
              Update Profile
            </Button>
          </Grid>
          <Grid item xs sx={{ display: { sm: 'none' } }}>
            <Button
              width='auto'
              variant='contained'
              color='primary'
              className='submitButton'
              onClick={handleLogout}
              sx={{ backgroundColor: '#0d47a1' }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {state.updateError && (
        <CustomErrorTemplate message={state.updateErrorMessage} />
      )}
      {state.updateSuccess && (
        <CustomSuccessTemplate message={state.updateSuccessMessage} />
      )}
    </>
  );
};

export default Profile;
