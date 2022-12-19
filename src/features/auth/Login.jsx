/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  LanguageIcon,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import CreateIcon from '@mui/icons-material/Create';
import SchoolIcon from '@mui/icons-material/School';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import i18next from 'i18next';
import { MuiTelInput } from 'mui-tel-input';
import { matchIsValidTel } from 'mui-tel-input';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { TailSpin } from "react-loader-spinner";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setOrganization } from './organizationSlice';
import { setCurrentUser } from './userSlice';
import { getOrgDetails } from '../../api/adminApi';
import {
  getOtpApi,
  login,
  loginWithoutOtpApi,
  verifyOtpApi,
} from '../../api/authApi';
import authBackground from '../../Assets/authBackground.png';
import authBanner from '../../Assets/authBanner.png';
import authGraphic from '../../Assets/authGraphic.png';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';

export const Login = () => {
  const [width, setWidth] = useState(0);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const navigate = useNavigate();
  const [userType, setUserType] = useState('teacher');
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    showPassword: false,
  });
  const [language, setLanguage] = useState(
    localStorage.getItem('authLanguage') || 'English'
  );
  const languages = [
    { id: 0, name: 'English' },
    { id: 1, name: 'हिन्दी' },
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
    success: false,
    error: false,
    loading: false,
    message: '',
    isLoggedIn: false,
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  // 'https://dev.smartpaperapp.com/v1/auth/login'
  async function handleSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true });

    if (inputs.username && inputs.password) {
      await login(inputs)
        .then(async (res) => {
          setState({
            ...state,
            success: true,
            error: false,
            loading: false,
            isLoggedIn: true,
            message: 'Login Successful',
          });
          // console.log('logged', res.data);
          const { token, user } = res.data;
          const orgResponse = await getOrgDetails({
            organizationId: user.organizationId,
            organizationName: user.organizationName,
            userType: user.type,
          });
          const { organizations } = orgResponse.data;
          // console.log('orgs', organizations);
          dispatch(setOrganization({ ...organizations }));
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('user', JSON.stringify(user));
          dispatch(setCurrentUser({ ...user, token }));
          // navigate('/authoring/books', { replace: true }); //does not get triggered any more because of protected/public routes
          // setTimeout(() => {
          // const { token, user } = res.data;
          // localStorage.setItem("token", JSON.stringify(token));
          // localStorage.setItem("user", JSON.stringify(user));
          // dispatch(setCurrentUser(user));
          // setCurrentUser(user);
          // }, 1500);
        })
        .catch((err) => {
          console.log(err);
          setState({
            ...state,
            loading: false,
            success: false,
            error: true,
            // message: err.response.data.message,
          });
          setTimeout(() => {
            setState({ ...state, error: false, message: '' });
          }, 3000);
        });
    }
  }

  const validateForm = () => {
    const { username, password } = inputs;
    if (userType === 'teacher') {
      return phoneObj?.otp?.toString().length === 6;
    }
    return password.trim().length > 4 && username.trim().length > 0;
  };

  function handleTypeChange(e) {
    setUserType(e.target.value);
  }
  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, showPassword: !inputs.showPassword });
  };

  const [phoneObj, setPhoneObj] = useState({ mobile: '+91', otp: '' }); // Contains the phone number and the OTP
  const [stepNum, setStepNum] = useState(0); // Step 0 - Phone number, Step 1 - OTP
  const handlePhoneChange = (newPhone) => {
    setPhoneObj((phoneObj) => ({
      ...phoneObj,
      mobile: newPhone,
    }));
  };
  function handleOtpChange(e) {
    setPhoneObj((phoneObj) => ({
      ...phoneObj,
      otp: Number(e.target.value),
    }));
  }

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true, success: false });
    const newPhone = phoneObj.mobile.split(' ').join('');
    const tempObj = phoneObj;
    tempObj.mobile = newPhone;
    try {
      const res = await getOtpApi(tempObj);
      setState({
        ...state,
        success: true,
        error: false,
        loading: false,
        isLoggedIn: true,
        message: 'OTP sent to your number!',
      });
      stepNum === 0 && res && setStepNum(1);
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
        setState({ ...state, error: false, message: '' });
      }, 3000);
    }
  }
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true, message: '', success: false });

    try {
      const res = await verifyOtpApi({
        ...phoneObj,
        otp: Number(phoneObj.otp),
      });
      setState({
        ...state,
        success: true,
        error: false,
        loading: false,
        isLoggedIn: true,
        message: 'Verification Successful',
      });
      const { token, user } = res.data;
      // localStorage.setItem('token', JSON.stringify(token));
      // localStorage.setItem('user', JSON.stringify(user));
      dispatch(setCurrentUser({ ...user, token }));
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        loading: false,
        success: false,
        error: true,
        message: e.message,
      });
    }
  }
  const handleLoginWithoutOtp = async () => {
    setState({ ...state, loading: true, success: false });
    const newPhone = phoneObj.mobile.split(' ').join('');
    const tempObj = {
      ...phoneObj,
      mobile: newPhone,
      inviteCode: '',
    };
    try {
      const res = await loginWithoutOtpApi(tempObj);
      setState({
        ...state,
        success: true,
        error: false,
        loading: false,
        isLoggedIn: true,
        message: 'Success!',
      });
      // stepNum === 0 && res && setStepNum(1);
      const { token, user } = res.data;
      const orgResponse = await getOrgDetails({
        organizationId: user.organizationId,
        organizationName: user.organizationName,
        userType: user.type,
      });
      const { organizations } = orgResponse.data;
      // console.log('orgs', organizations);
      dispatch(setOrganization({ ...organizations }));
      dispatch(setCurrentUser({ ...user, token }));
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
        setState({ ...state, error: false, message: '' });
      }, 3000);
    }
  };
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    if (width <= 768) {
      setUserType('teacher');
    }
  }, [width]);
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <Grid
      container
      component='main'
      style={{ padding: '0rem 0' }}
      height={{ xs: '100%', md: '100vh' }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        // display='flex'
        // width={{ 'xs': '100%' }}
        // justifyContent='center'
        // alignItems='center'
        // textAlign='center'
        margin={{ xs: '2rem 0', md: '0 0' }}
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        {/* <Typography
          variant='h2'
          component='div'
          gutterBottom
          justifyContent='center'
          margin='auto'
          style={{
            display: 'flex',
            // backgroundColor:"#000"
          }}
        >
          My SmartPaper
        </Typography> */}
        <Box
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${authBackground})`,
            backgroundRepeat: `no-repeat, repeat`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          <img
            src={authGraphic}
            alt='Smart paper graphic'
            style={{
              maxWidth: '60%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <img
            src={authBanner}
            alt='Smart paper graphic'
            style={{
              width: '100%',
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
            }}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        display='flex'
        component={Paper}
        elevation={0}
        square
        style={{ borderLeft: '1px solid #c4c4c4' }}
      >
        <FormControl
          fullWidth
          sx={{
            width: { xs: '10rem', sm: '10rem' },
            position: 'absolute',
            top: '1rem',
            right: '1rem',
          }}
        >
          <InputLabel id='demo-simple-select-label'>Language</InputLabel>
          <Select
            value={language}
            label='Language'
            onChange={(event, newValue) => {
              i18next.changeLanguage(event.target.value, (err, t) => {
                if (err) return console.log('Something went wrong');
                t('signIn');
              });
              localStorage.setItem('authLanguage', event.target.value);
              setLanguage(event.target.value);
            }}
          >
            {languages.map((lang) => (
              <MenuItem value={lang.name} key={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
          }}
          margin={{ xs: '9em 0 0 0', md: '9rem 0 1rem 0' }}
        >
          <Avatar style={{ margin: 8, bgcolor: '#FFFFFF' }}>
            <LockOutlined />
          </Avatar>
          <Typography component='h1' variant='h5' mb='1rem'>
            {t('signIn')}
          </Typography>
          <Box
            sx={{ minWidth: '100%' }}
            padding={{ xs: '0 1rem', md: '0 4rem' }}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
            {stepNum === 0 && width > 768 && (
              <FormControl
                style={{ width: '100%', padding: '0 1rem' }}
                margin='normal'
              >
                <FormLabel id='demo-radio-buttons-group-label' margin='normal'>
                  {t('userType')}
                </FormLabel>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  value={userType}
                  name='userType'
                  row
                  margin='normal'
                  onChange={handleTypeChange}
                >
                  <FormControlLabel
                    value='teacher'
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {' '}
                        <SchoolIcon /> {t('teacher')}
                      </Box>
                    }
                    margin='normal'
                  />
                  <FormControlLabel
                    value='author'
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        {' '}
                        <CreateIcon /> {t('author')}
                      </Box>
                    }
                    margin='normal'
                  />
                </RadioGroup>
              </FormControl>
            )}

            {userType === 'author' ? (
              <>
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='username'
                    label={t('username')}
                    name='username'
                    value={inputs.username}
                    autoComplete='username'
                    autoFocus
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl style={{ width: '100%' }} variant='outlined'>
                  <InputLabel htmlFor='password' required>
                    {t('password')}
                  </InputLabel>
                  <OutlinedInput
                    id='password'
                    name='password'
                    label={t('password')}
                    autoComplete='current-password'
                    required
                    fullWidth
                    type={inputs.showPassword ? 'text' : 'password'}
                    onChange={handleChange}
                    value={inputs.password}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          edge='end'
                        >
                          {inputs.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Grid
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                  mb='1.5rem'
                  mt='0.5rem'
                >
                  <Link to='/forgot-password'>{t('forgotPassword')}?</Link>
                </Grid>

                <Grid
                  container
                  style={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Box
                    gap='1rem'
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-end'
                  >
                    <LoadingButton
                      fullWidth
                      color='primary'
                      variant='contained'
                      style={{ margin: '0.5rem 0', width: '10rem' }}
                      onClick={(e) => handleSubmit(e)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      disabled={!validateForm() || state.loading}
                      loading={state.loading}
                    >
                      {t('signIn')}
                    </LoadingButton>

                    <Link to='/register'>{t('dontHaveAccount')}</Link>
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                {stepNum === 0 ? (
                  <>
                    {/* <form onSubmit={handlePhoneSubmit}> */}
                    <form onSubmit={handleLoginWithoutOtp}>
                      <FormControl style={{ width: '100%' }}>
                        <MuiTelInput
                          value={phoneObj.mobile}
                          onChange={handlePhoneChange}
                          style={{ width: '100%' }}
                          onlyCountries={['IN', 'US', 'JP', 'NL']}
                        />
                        <Box
                          gap='1rem'
                          display='flex'
                          flexDirection='column'
                          alignItems='flex-end'
                          mt='1.5rem'
                        >
                          <LoadingButton
                            fullWidth
                            color='primary'
                            type='submit'
                            variant='contained'
                            style={{
                              margin: '1rem 0 0.5rem 0',
                              width: '10rem',
                            }}
                            // onClick={(e) => handlePhoneSubmit(e)}
                            onClick={(e) => handleLoginWithoutOtp(e)}
                            // onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit(e)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleLoginWithoutOtp(e)
                            }
                            disabled={
                              state.loading || !matchIsValidTel(phoneObj.mobile)
                            }
                            loading={state.loading}
                          >
                            {t('submit')}
                          </LoadingButton>
                          <Link to='/register'>{t('dontHaveAccount')}</Link>
                        </Box>
                      </FormControl>
                    </form>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleOtpSubmit}>
                      <FormControl style={{ width: '100%' }}>
                        {/* todo: Password visibility to be added before deploying */}
                        <TextField
                          autoFocus
                          margin='normal'
                          required
                          fullWidth
                          name='otp'
                          label='OTP'
                          type='text'
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          id='otp'
                          value={phoneObj.otp || ''}
                          autoComplete='otp'
                          onChange={handleOtpChange}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleOtpSubmit(e)
                          }
                        />
                      </FormControl>
                      <Grid
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                        mb='1.5rem'
                        mt='0.5rem'
                      >
                        <LoadingButton
                          variant='text'
                          onClick={(e) => handlePhoneSubmit(e)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handlePhoneSubmit(e)
                          }
                          disabled={
                            state.loading || !matchIsValidTel(phoneObj.mobile)
                          }
                          loading={state.loading}
                        >
                          {t('resendOtp')}
                        </LoadingButton>
                      </Grid>
                      <Box
                        gap='1rem'
                        display='flex'
                        flexDirection='column'
                        alignItems='flex-end'
                        mt='1.5rem'
                      >
                        <LoadingButton
                          fullWidth
                          color='primary'
                          variant='contained'
                          style={{
                            margin: '1rem 0 0.5rem 0',
                            width: '10rem',
                          }}
                          onClick={(e) => handleOtpSubmit(e)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleOtpSubmit(e)
                          }
                          disabled={!validateForm() || state.loading}
                          loading={state.loading}
                        >
                          {t('submit')}
                        </LoadingButton>
                      </Box>
                    </form>
                  </>
                )}
              </>
            )}
          </Box>
          {state.success && <CustomSuccessTemplate message={state.message} />}
          {state.error && <CustomErrorTemplate message={state.message} />}
        </Box>
      </Grid>
    </Grid>
  );
};
