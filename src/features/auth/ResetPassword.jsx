/* eslint-disable react-hooks/exhaustive-deps */
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { getUserApi, resetPassword } from '../../api/authApi';
import authBackground from '../../Assets/authBackground.png';
import authBanner from '../../Assets/authBanner.png';
import authGraphic from '../../Assets/authGraphic.png';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';
// import { TailSpin } from "react-loader-spinner";
// import { useDispatch } from "react-redux";
// import { forgotPassword } from "../../api/authApi";

export const ResetPassword = () => {
  // const history = useHistory();
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    password: '',
    confirmPassword: '',
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
    verifying: false,
    verificationSuccess: false,
    verificationError: false,
    verificationErrorMessage: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }
  const { userId, userToken } = useParams();
  const verifyUser = async () => {
    setState((state) => ({ ...state, verifying: true }));

    try {
      const res = await getUserApi(
        { userId: userId },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (res.data.user.resetToken === userToken) {
        setState((state) => ({
          ...state,
          verificationSuccess: true,
          verifying: false,
        }));
      } else {
        setState((state) => ({
          ...state,
          verificationError: true,
          verifying: false,
          verificationErrorMessage:
            'This reset link has expired! Please try again with a new link.',
        }));
      }
    } catch (e) {
      setState((state) => ({
        ...state,
        verificationError: true,
        verifying: false,
        verificationErrorMessage:
          'This reset link has expired! Please try again with a new link.',
      }));
    }
  };
  useEffect(() => {
    verifyUser();
  }, [userId, userToken]);
  console.log(userId, userToken);
  const handleClickShowPassword = (confirm) => {
    if (confirm === true) {
      setInputs({
        ...inputs,
        showConfirmPassword: !inputs.showConfirmPassword,
      });
    } else {
      setInputs({ ...inputs, showPassword: !inputs.showPassword });
    }
  };
  // 'https://dev.smartpaperapp.com/v1/auth/login'
  async function handleSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true });
    console.log(inputs);
    await resetPassword({userId:userId, password:inputs.password})
        .then((res) => {
          console.log(res)
          setState({
            ...state,
            success: true,
            error: false,
            loading: false,
            isLoggedIn: true,
            message: res.data.message,
          });
          setTimeout(() => {
            setState({ ...state, success: false, message: "" });
            navigate('/login')
          }, 1500);
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
        setState({ ...state, error: false, message: "" });
      }, 3000);
    });
  }

  const validateForm = () => {
    const { password, confirmPassword } = inputs;
    return password.trim().length > 4 && password === confirmPassword;
  };

  return (
    <Grid
      container
      component="main"
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
            alt="Smart paper graphic"
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
            alt="Smart paper graphic"
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
        display="flex"
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
          <InputLabel id="demo-simple-select-label">Language</InputLabel>
          <Select
            value={language}
            label="Language"
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
        {state.verifying ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {!state.verificationSuccess ? (
              <>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    >
                    <Avatar style={{ margin: 8, bgcolor: '#FFFFFF' }}>
                      <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5" mb="1.5rem">
                      {t('resetPassword')}
                    </Typography>
                    <Typography>
                    {state.verificationErrorMessage}
                </Typography>
                  </Box>
              </>
            ) : (
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  // padding:"0 1rem"
                }}
                margin={{ xs: '9em 0 0 0', md: '9rem 0 1rem 0' }}
              >
                <Avatar style={{ margin: 8, bgcolor: '#FFFFFF' }}>
                  <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                  {t('resetPassword')}
                </Typography>
                <Box
                  sx={{ minWidth: '100%' }}
                  padding={{ xs: '0 1rem', md: '0 4rem' }}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <FormControl
                    style={{ width: '100%' }}
                    margin="normal"
                    variant="outlined"
                  >
                    <InputLabel htmlFor="password" required>
                      {t('password')}
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      name="password"
                      label={t('password')}
                      autoComplete="current-password"
                      required
                      fullWidth
                      type={inputs.showPassword ? 'text' : 'password'}
                      onChange={handleChange}
                      value={inputs.password}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
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
                  <FormControl
                    style={{ width: '100%' }}
                    margin="normal"
                    variant="outlined"
                  >
                    <InputLabel htmlFor="password" required>
                      {t('confirmPassword')}
                    </InputLabel>
                    <OutlinedInput
                      id="confirmPassword"
                      name="confirmPassword"
                      label={t('confirmPassword')}
                      autoComplete="current-password"
                      required
                      fullWidth
                      type={inputs.showConfirmPassword ? 'text' : 'password'}
                      onChange={handleChange}
                      value={inputs.confirmPassword}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleClickShowPassword(true)}
                            edge="end"
                          >
                            {inputs.showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {inputs.confirmPassword!=='' && inputs.password!==inputs.confirmPassword && <Typography color='red'>Passwords don't match!</Typography>}
                  <Box
                    gap="1rem"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    mt={4}
                  >
                    <LoadingButton
                      color="primary"
                      variant="contained"
                      style={{
                        margin: '0.5rem 0',
                        width: '10rem',
                      }}
                      onClick={(e) => handleSubmit(e)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      disabled={
                        !validateForm() || state.loading || state.isLoggedIn
                      }
                      loading={state.loading}
                    >
                      {t('resetPassword')}
                    </LoadingButton>
                  </Box>
                </Box>
                {state.success && (
                  <CustomSuccessTemplate message={state.message} />
                )}
                {state.error && <CustomErrorTemplate message={state.message} />}
              </Box>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

// export default withStyles(styles, { withTheme: true })(Login);
