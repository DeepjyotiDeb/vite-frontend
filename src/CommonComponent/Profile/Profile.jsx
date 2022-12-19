/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { updateTeacherApi, updateUserApi } from '../../api/authApi';
import CustomAvatar from '../../elements/CustomAvatar';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';
import Loader from '../../elements/Loader';
import { currentUser, setCurrentUser } from '../../features/auth/userSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    margin: 'auto',
    // minWidth: 500,
    width: 'auto',
    // maxWidth: '50%',
    borderRadius: '10px',
    flexGrow: 1,
  },
}));

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(currentUser);
  const location = useLocation();
  const { t } = useTranslation();
  const languages = [
    { id: 0, name: 'English', value: 'English' },
    { id: 1, name: 'हिन्दी', value: 'हिन्दी' },
    // { id: 2, name: "Gujarati" },
    // { id: 3, name: "Bengali" },
    // { id: 4, name: "Punjabi" },
    // { id: 5, name: "Japanese" },
    // { id: 6, name: "Chinese" },
    // { id: 7, name: "German" },
    // { id: 8, name: "French" },
    // { id: 9, name: "Espanol" },
  ];

  const [state, setState] = useState({
    mobile: '',
    name: '',
    email: '',
    language: user.language,
    organizationName: '',
    changedFields: [],
    user: null,
    userId: '',
    updateError: false,
    updateSuccess: false,
    updateErrorMessage: '',
    updateSuccessMessage: '',
    loading: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // getUserDetails();
    if (user === null || user === undefined) {
      navigate('/login');
    } else {
      setState((prevState) => ({
        ...prevState,
        user: user,
        mobile: user.mobile || '',
        language: user.language || '',
        userId: user._id,
        name: user.name || '',
        email: user.email,
        organizationName: user.organizationName,
        changedFields: [],
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // useEffect(() => {
  //   console.log(
  //     (!state.changedFields.length || user.language === state.language)
  //   );
  //   console.log('state. lang', state.language);
  // }, [state.language]);
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
    const { token } = user;

    for (const field of state.changedFields) {
      updateObj[field] = state[field];
    }
    if (user.type === 'author' || user.type === 'admin') {
      console.log('update', updateObj);
      await updateUserApi(
        {
          userId: state.user._id,
          ...updateObj,
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      )
        .then((res) => {
          const { user } = res.data;
          dispatch(setCurrentUser({ ...user, token }));
          setState((prevState) => ({
            ...prevState,
            user: user,
            name: user.name,
            email: user.email,
            organization: user.organization,
            userId: user._id,
            langauge: user.language,
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
    }
    if ((user.type === 'student', user.type === 'teacher')) {
      setState({ ...state, loading: true });
      await updateTeacherApi(
        {
          userId: user._id,
          organizationId: user.organizationId,
          username: state.name,
          language: state.language,
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

          dispatch(setCurrentUser({ token, ...user }));
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
            loading: false,
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
            loading: false,
          }));
          setTimeout(() => {
            setState((prevState) => ({
              ...prevState,
              updateError: false,
              updateErrorMessage: '',
            }));
          }, 4000);
        });
    }
  };
  // 'https://dev.smartpaperapp.com/smart-user/get'
  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.clear();
    navigate('/login');
  };

  // const getSelectedItem = () => {
  //   const item = languages.find((language) => {
  //     console.log('lang', language);
  //     if (language.name === user.language) return language;
  //   });
  //   return item || {};
  // };
  const classes = useStyles();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {location.pathname.includes('authoring') && (
        <BreadcrumbsItem to='/home/myProfile'>My Profile</BreadcrumbsItem>
      )}
      {/* <button onClick={() => console.log('user', user)}>log</button> */}
      {/* {user} */}
      {(user.type === 'teacher' || user.type === 'student') && (
        <Box sx={{ height: { xs: 0, sm: '2rem' } }}></Box>
      )}
      <Paper
        className={classes.paper}
        elevation={1}
        variant='elevation'
        square
        sx={{
          boxShadow: { xs: 'none', sm: '1px 1px #dadada' },
          border: { sm: '1px solid #dadada' },
          minWidth: { xs: 'none', sm: 500 },
          maxWidth: { xs: 'none', sm: 500 },
          // marginTop: user.type === 'teacher' && '20px',
        }}
      >
        {state.loading && (
          <Loader loadingMessage={'Please wait, updating user info'} />
        )}
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={3}
        >
          <Grid item xs>
            <CustomAvatar
              user={user}
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                width: 54,
                height: 54,
                fontSize: '2.2rem',
              }}
            />
            {/* <Avatar alt={state.name} sx={{ width: 64, height: 64 }} /> */}
          </Grid>
          {state.mobile && (
            <Grid item xs>
              <TextField
                style={{ width: '300px' }}
                size='medium'
                id='number'
                name='number'
                value={state.mobile}
                label={t('number')}
                inputProps={{ readOnly: true }}
              />
            </Grid>
          )}
          {/* {user.name && ( */}
          <Grid item xs>
            <TextField
              style={{ width: '300px' }}
              margin='normal'
              size='medium'
              type='text'
              id='name'
              name='name'
              value={state.name}
              label={t('name')}
              onBlur={updateFields}
              onChange={handleChange}
            />
          </Grid>
          {/* )} */}
          {user.organizationName && (
            <Grid item xs>
              <TextField
                style={{ width: '300px', pt: 0 }}
                margin='normal'
                size='medium'
                type='text'
                id='organization'
                name='organizationName'
                value={state.organizationName}
                label={t('organization')}
                onBlur={updateFields}
                inputProps={{ readOnly: true }}
                // onChange={handleChange}
              />
            </Grid>
          )}
          {user.type === ('teacher' || 'student') && (
            <Grid item sx={{ pt: '0' }}>
              {/* <FormControl
                sx={{
                  minWidth: '300px',
                }}
                fullWidth
              >
                <Autocomplete
                  fullWidth
                  id='language'
                  name='language'
                  disablePortal
                  options={languages}
                  // value={getSelectedItem}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) => {
                    return option.name;
                  }}
                  onChange={(event, newValue) => {
                    // console.log(newValue, state.language);
                    setState((prevState) => ({
                      ...prevState,
                      language: newValue === null ? '' : newValue.value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('language')}
                      fullWidth
                      margin='normal'
                      // value={state.language}
                      sx={{ minWidth: '100%' }}
                    />
                  )}
                />
              </FormControl> */}
              <FormControl fullWidth>
                <InputLabel id='language-label'>{t('language')}</InputLabel>
                <Select
                  labelId='language-select-label'
                  id='language-simple-select'
                  value={state.language}
                  label={t('language')}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      language: e.target.value,
                    }));
                  }}
                  style={{ width: '300px' }}
                >
                  {languages.map((language, id) => (
                    <MenuItem value={language.value} key={id}>
                      {language.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {state.email && (
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
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          )}
          <Grid item xs>
            <Button
              disabled={
                !state.changedFields.length && user.language === state.language
              }
              width='auto'
              variant='contained'
              color='primary'
              className='submitButton'
              onClick={() => updateProfile()}
              sx={{ backgroundColor: '#0d47a1' }}
            >
              {t('updateProfile')}
            </Button>
          </Grid>
          {(user.type === 'teacher' || user.type === 'student') && (
            <Grid item xs sx={{ display: { sm: 'none' } }}>
              <Button
                width='auto'
                variant='outlined'
                color='primary'
                className='submitButton'
                onClick={handleLogout}
                // sx={{ backgroundColor: '#0d47a1' }}
              >
                Logout
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
      {state.updateError && (
        <CustomErrorTemplate message={state.updateErrorMessage} />
      )}
      {state.updateSuccess && (
        <CustomSuccessTemplate message={state.updateSuccessMessage} />
      )}
    </Box>
  );
};
