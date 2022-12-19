/* eslint-disable react-hooks/exhaustive-deps */
import { LockOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { forgotPassword } from '../../api/authApi';
import authBackground from '../../Assets/authBackground.png';
import authBanner from '../../Assets/authBanner.png';
import authGraphic from '../../Assets/authGraphic.png';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';
// import { TailSpin } from "react-loader-spinner";
// import { useDispatch } from "react-redux";
// import { forgotPassword } from "../../api/authApi";

export const ForgotPassword = () => {
  // const history = useHistory();
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email:'',
    username: '',
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
    console.log(inputs);
    await forgotPassword(inputs)
        .then(() => {
          setState({
            ...state,
            success: true,
            error: false,
            loading: false,
            isLoggedIn: true,
            message: "A password reset link has been sent to your mailbox!",
          });
          setTimeout(() => {
            setState({ ...state, success: false, message: "" });
           
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
    const { username, email } = inputs;
    return (username.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) ;
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
            {t('forgotPassword')}
          </Typography>
          <Box
            sx={{ minWidth: '100%' }}
            padding={{ xs: '0 1rem', md: '0 4rem' }}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl style={{ width: '100%' }} >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label={t('username')}
                name="username"
                value={inputs.username}
                autoComplete="username"
                autoFocus
                onChange={handleChange}
              />
                </FormControl>
                <FormControl style={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('emailAddress')}
                name="email"
                value={inputs.email}
                autoComplete="email"
                onChange={handleChange}
              />
                </FormControl>
              <Box
                gap="1rem"
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                mt="1.5rem"
              >
                <LoadingButton
                  color="primary"
                  variant="contained"
                  style={{
                    margin: '1rem 0 0.5rem 0',
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
            <CustomSuccessTemplate message="New password has been sent to this email id" />
          )}
          {state.error && <CustomErrorTemplate message={state.message} />}
        </Box>
      </Grid>
    </Grid>
  );
};

// export default withStyles(styles, { withTheme: true })(Login);
