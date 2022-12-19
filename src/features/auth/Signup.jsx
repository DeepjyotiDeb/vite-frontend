/* eslint-disable react-hooks/exhaustive-deps */
import { Business, LockOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';
import SchoolIcon from '@mui/icons-material/School';
import { LoadingButton } from '@mui/lab';
import {
  // Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import i18next from 'i18next';
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { TailSpin } from "react-loader-spinner";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { setCurrentUser } from './userSlice';
import {
  checkUserApi,
  createOrgApi,
  getOtpApi,
  loginWithoutOtpApi,
  signup,
  verifyOtpApi,
} from '../../api/authApi';
// import { getOrganizations } from '../../api/organizationApi';
import authBackground from '../../Assets/authBackground.png';
import authBanner from '../../Assets/authBanner.png';
import authGraphic from '../../Assets/authGraphic.png';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';

export const Signup = () => {
  const [width, setWidth] = useState(0);
  const { t } = useTranslation();
  let location = useLocation();
  const params = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let value = params.code;
  value !== null && console.log(value.length === 6);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    // organization: '',
    // organizationId: '',
    userType: '',
    inviteCode: value || '',
    name: '',
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
  // const [orgs, setOrgs] = useState([]);
  // useEffect(()=>{
  //   console.log(inputs)
  // },[inputs])
  const [state, setState] = useState({
    success: false,
    error: false,
    loading: false,
    message: '',
    isLoggedIn: false,
  });
  function handleChange(e) {
    // if (state.contentSubType === 'checkbox') {
    const { name, value } = e.target;

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  // 'https://dev.smartpaperapp.com/v1/auth/login'
  async function handleSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true });

    if (inputs.email && inputs.password) {
      await signup(inputs)
        .then((_res) => {
          setState({
            ...state,
            success: true,
            error: false,
            loading: false,
            isLoggedIn: true,
            message: 'Signup Successful',
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setState({
            ...state,
            loading: false,
            success: false,
            error: true,
            message: err.response.data.message,
          });
          setTimeout(() => {
            setState({ ...state, error: false, message: '' });
          }, 5000);
        });
    }
  }
  const [orgInputs, setOrgInputs] = useState({
    name: '',
    email: '',
    adminUsername: '',
    adminPassword: '',
  });
  function handleOrgChange(e) {
    // if (state.contentSubType === 'checkbox') {
    const { name, value } = e.target;

    setOrgInputs((orgInputs) => ({ ...orgInputs, [name]: value }));
  }
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  useEffect(() => {
    if (orgInputs.adminUsername.length > 0) {
      const checkUser = setTimeout(() => {
        checkUserApi({ username: orgInputs.adminUsername }).then((res) => {
          if (res.data.isTaken) {
            setUsernameAvailable(false);
          } else {
            setUsernameAvailable(true);
          }
        });
      }, 2000);

      return () => clearTimeout(checkUser);
    }
  }, [orgInputs.adminUsername]);

  async function handleOrgSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true });
    console.log(orgInputs);

    if (
      orgInputs.email &&
      orgInputs.name &&
      orgInputs.adminUsername &&
      orgInputs.adminPassword
    ) {
      await createOrgApi(orgInputs)
        .then((_res) => {
          setState({
            ...state,
            success: true,
            error: false,
            loading: false,
            isLoggedIn: true,
            message: 'Organization created!',
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setState({
            ...state,
            loading: false,
            success: false,
            error: true,
            message: err.response.data.message,
          });
          setTimeout(() => {
            setState({ ...state, error: false, message: '' });
          }, 5000);
        });
    }
  }
  const validateForm = () => {
    const { email, password, username, userType, inviteCode } = inputs;
    if (userType === 'teacher') {
      return phoneObj?.otp?.toString().length === 6;
    } else if (userType === 'organization') {
      const { name, email, adminPassword, adminUsername } = orgInputs;
      return (
        adminPassword.trim().length > 4 &&
        adminUsername.trim().length > 0 &&
        name.trim().length > 0 &&
        email.trim().length > 0 &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      );
    }
    return (
      password.trim().length > 4 &&
      username.trim().length > 0 &&
      // organization.trim().length > 0 &&
      inviteCode.trim().length > 0 &&
      userType.trim().length > 0 &&
      email.trim().length > 0 &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    );
  };

  useEffect(() => {
    if (width > 0 && width <= 768) {
      console.log(width);
      setUserType('teacher');
      setStepNum(1);
    }
  }, [width]);
  const [userType, setUserType] = useState('teacher');
  const [stepNum, setStepNum] = useState(0);
  const [teacherStepNum, setTeacherStepNum] = useState(0);
  const [phoneObj, setPhoneObj] = useState({
    mobile: '+91',
    inviteCode: value || '',
  }); // Contains the phone number and the OTP
  const handlePhoneChange = (newPhone) => {
    setPhoneObj((phoneObj) => ({
      ...phoneObj,
      mobile: newPhone,
    }));
  };
  const handleInviteCodeChange = (e) => {
    setPhoneObj((phoneObj) => ({ ...phoneObj, inviteCode: e.target.value }));
  };
  function handleOtpChange(e) {
    setPhoneObj((phoneObj) => ({
      ...phoneObj,
      otp: Number(e.target.value),
    }));
  }
  const handleTypeChange = (e) => {
    setUserType(e.target.value);
    setInputs((inputs) => ({ ...inputs, userType: e.target.value }));
  };
  const handleNext = (e) => {
    e.preventDefault();
    setStepNum(stepNum + 1);
  };
  const handleBack = () => {
    teacherStepNum === 1 ? setTeacherStepNum(0) : setStepNum(0);
  };

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
      teacherStepNum === 0 && res && setTeacherStepNum(1);
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
      // console.log(res);
      const { token, user } = res.data;
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('user', JSON.stringify(user));
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
    console.log(phoneObj);
    setState({ ...state, loading: true, success: false });
    const newPhone = phoneObj.mobile.split(' ').join('');
    const tempObj = {
      ...phoneObj,
      mobile: newPhone,
      // organizationId: process.env.REACT_APP_CSF_ORG_ID,
      // organizationName: 'CSF',
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
              // left:'50%',
              // transform:'translate(-50%, -50%)'
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
            onChange={(event) => {
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
          {stepNum > 0 && width > 768 && (
            <Paper
              elevation={1}
              onClick={handleBack}
              sx={{
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '2.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '0.5rem',
                left: '4rem',
                transform: 'translateX(50%)',
                cursor: 'pointer',
              }}
            >
              <ArrowBackIcon />
            </Paper>
          )}

          <Avatar style={{ margin: 8, bgcolor: '#FFFFFF' }}>
            <LockOutlined />
          </Avatar>
          <Typography component='h1' variant='h5'>
            {t('signUp')}
          </Typography>
          <Box
            sx={{ minWidth: '100%' }}
            padding={{ xs: '0 1rem', md: '0 4rem' }}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
            {stepNum === 0 ? (
              <>
                <form onSubmit={handleNext}>
                  <Typography
                    variant='h5'
                    minWidth='100%'
                    component='div'
                    gutterBottom
                    textAlign='center'
                    mt='2rem'
                    mb='1.5rem'
                    fontSize={{ xs: '1rem', md: '1.5rem' }}
                  >
                    {t('welcomeLetUsKnow')}
                  </Typography>
                  <FormControl
                    style={{
                      width: '100%',
                      padding: '0 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      // alignItems: "center",
                      marginTop: '1.5rem',
                    }}
                  >
                    <FormLabel
                      id='demo-radio-buttons-group-label'
                      margin='normal'
                    >
                      {t('userType')}
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby='demo-radio-buttons-group-label'
                      name='userType'
                      row
                      margin='normal'
                      onChange={handleTypeChange}
                      value={userType}
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
                      <FormControlLabel
                        value='organization'
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
                            <Business /> {t('organization')}
                          </Box>
                        }
                        margin='normal'
                      />
                    </RadioGroup>
                  </FormControl>
                  <Grid container justifyContent='flex-end'>
                    <Box
                      // item
                      gap='1rem'
                      display='flex'
                      flexDirection='column'
                      alignItems='flex-end'
                    >
                      <Button
                        color='primary'
                        type='submit'
                        variant='contained'
                        style={{
                          margin: '0.5rem 0',
                          width: '10rem',
                        }}
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                        onKeyDown={(e) => e.key === 'Enter' && handleNext(e)}
                        disabled={userType === ''}
                      >
                        {t('next')}
                      </Button>
                      <Link to='/login'>{t('alreadyHaveAccount')}</Link>
                    </Box>
                  </Grid>
                </form>
              </>
            ) : (
              <>
                {userType === 'author' ? (
                  <>
                    <form onSubmit={handleSubmit}>
                      {' '}
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
                      <FormControl style={{ width: '100%' }}>
                        {/* todo: Password visibility to be added before deploying */}
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          name='password'
                          label={t('password')}
                          type='password'
                          id='password'
                          value={inputs.password}
                          autoComplete='current-password'
                          onChange={handleChange}
                          // onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />
                      </FormControl>
                      {/* <FormControl style={{ width: '100%' }}>
                        <Autocomplete
                          disablePortal
                          id='combo-box-demo'
                          options={orgs || []}
                          getOptionLabel={(option) => option.name}
                          // onChange={handleChange}
                          onChange={(event, newValue) => {
                            newValue === null
                              ? setInputs((inputs) => ({
                                  ...inputs,
                                  organization: '',
                                  organizationId: '',
                                }))
                              : setInputs((inputs) => ({
                                  ...inputs,
                                  organization: newValue.name,
                                  organizationId: newValue._id,
                                }));
                          }}
                          name='organization'
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('organization')}
                              fullWidth
                              margin='normal'
                            />
                          )}
                        />
                      </FormControl> */}
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='email'
                          label={t('emailAddress')}
                          name='email'
                          value={inputs.email}
                          autoComplete='email'
                          onChange={handleChange}
                        />
                      </FormControl>{' '}
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='inviteCode'
                          label={t('inviteCode')}
                          name='inviteCode'
                          value={inputs.inviteCode}
                          autoComplete='inviteCode'
                          onChange={handleChange}
                        />
                      </FormControl>
                      <Grid container justifyContent='flex-end' mt='1.5rem'>
                        <Box
                          gap='1rem'
                          display='flex'
                          flexDirection='column'
                          alignItems='flex-end'
                        >
                          <LoadingButton
                            color='primary'
                            variant='contained'
                            type='submit'
                            style={{ margin: '0.5rem 0', width: '10rem' }}
                            onClick={(e) => handleSubmit(e)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleSubmit(e)
                            }
                            disabled={
                              !validateForm() ||
                              state.loading ||
                              state.isLoggedIn
                            }
                            loading={state.loading}
                          >
                            {t('signUp')}
                          </LoadingButton>
                          <Link to='/login'>{t('alreadyHaveAccount')}</Link>
                        </Box>
                      </Grid>
                    </form>
                  </>
                ) : userType === 'teacher' ? (
                  <>
                    {' '}
                    {teacherStepNum === 0 ? (
                      <>
                        {/* <form onSubmit={handlePhoneSubmit}> */}
                        <form onSubmit={handleLoginWithoutOtp}>
                          <MuiTelInput
                            value={phoneObj.mobile}
                            onChange={handlePhoneChange}
                            style={{ width: '100%', marginTop: '1rem' }}
                            onlyCountries={['IN', 'US', 'JP', 'NL']}
                          />
                          <FormControl style={{ width: '100%' }}>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='inviteCode'
                              label={t('inviteCode')}
                              name='inviteCode'
                              value={phoneObj.inviteCode}
                              autoComplete='inviteCode'
                              onChange={handleInviteCodeChange}
                            />
                          </FormControl>

                          <Grid container justifyContent='flex-end' mt='1.5rem'>
                            <Box
                              // item
                              gap='1rem'
                              display='flex'
                              flexDirection='column'
                              alignItems='flex-end'
                            >
                              <LoadingButton
                                color='primary'
                                variant='contained'
                                type='submit'
                                style={{
                                  margin: '1rem 0 0.5rem 0',
                                  width: '10rem',
                                }}
                                // onClick={(e) => handlePhoneSubmit(e)}
                                onClick={(e) => handleLoginWithoutOtp(e)}
                                // onKeyDown={(e) =>
                                //   e.key === 'Enter' && handlePhoneSubmit(e)
                                // }
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && handleLoginWithoutOtp(e)
                                }
                                disabled={
                                  state.loading ||
                                  !matchIsValidTel(phoneObj.mobile)
                                }
                                loading={state.loading}
                              >
                                {t('submit')}
                              </LoadingButton>

                              <Link to='/login'>{t('alreadyHaveAccount')}</Link>
                            </Box>
                          </Grid>
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
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
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
                                state.loading ||
                                !matchIsValidTel(phoneObj.mobile)
                              }
                              loading={state.loading}
                            >
                              {t('resendOtp')}
                            </LoadingButton>
                          </Grid>
                          <Box
                            // item
                            gap='1rem'
                            display='flex'
                            flexDirection='column'
                            alignItems='flex-end'
                            mt='1.5rem'
                          >
                            <LoadingButton
                              type='submit'
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
                ) : (
                  <>
                    <form onSubmit={handleOrgSubmit}>
                      {' '}
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='name'
                          label={t('organization') + ' ' + t('name')}
                          name='name'
                          value={orgInputs.name}
                          autoComplete='name'
                          autoFocus
                          onChange={handleOrgChange}
                        />
                      </FormControl>
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='email'
                          label={t('organization') + ' ' + t('emailAddress')}
                          name='email'
                          value={orgInputs.email}
                          autoComplete='email'
                          onChange={handleOrgChange}
                        />
                      </FormControl>{' '}
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='adminUsername'
                          label='Admin Username'
                          name='adminUsername'
                          value={orgInputs.adminUsername}
                          autoComplete='adminUsername'
                          onChange={handleOrgChange}
                        />
                      </FormControl>
                      {!usernameAvailable && (
                        <Typography
                          color='red'
                          sx={{ mb: '1rem', fontSize: '0.75rem' }}
                        >
                          This username is already taken!
                        </Typography>
                      )}
                      <FormControl style={{ width: '100%' }}>
                        {/* todo: Password visibility to be added before deploying */}
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          name='adminPassword'
                          label=' Admin Password'
                          type='password'
                          id='adminPassword'
                          value={orgInputs.adminPassword}
                          autoComplete='adminPassword'
                          onChange={handleOrgChange}
                          // onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />
                      </FormControl>
                      <Grid container justifyContent='flex-end' mt='1.5rem'>
                        <Box
                          gap='1rem'
                          display='flex'
                          flexDirection='column'
                          alignItems='flex-end'
                        >
                          <LoadingButton
                            color='primary'
                            variant='contained'
                            type='submit'
                            style={{ margin: '0.5rem 0', width: '10rem' }}
                            onClick={(e) => handleOrgSubmit(e)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleOrgSubmit(e)
                            }
                            disabled={
                              !validateForm() ||
                              !usernameAvailable ||
                              state.loading ||
                              state.isLoggedIn
                            }
                            loading={state.loading}
                          >
                            Create
                          </LoadingButton>
                        </Box>
                      </Grid>
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

// export default withStyles(styles, { withTheme: true })(Login);
