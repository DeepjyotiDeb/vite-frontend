import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setCurrentUser } from '../auth/userSlice';
import { login } from '../../api/authApi';
import CustomErrorTemplate from '../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../elements/CustomSuccessTemplate';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const validateForm = () => {
    const { username, password } = inputs;
    return password.trim().length > 4 && username.trim().length > 0;
  };
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    showPassword: false,
    // userType:'admin',
  });
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
  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, showPassword: !inputs.showPassword });
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setState({ ...state, loading: true });

    if (inputs.username && inputs.password) {
      await login(inputs)
        .then((res) => {
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
            message: err.response.data.message,
          });
          setTimeout(() => {
            setState({ ...state, error: false, message: '' });
          }, 3000);
        });
    }
  }
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        padding: { xs: '2rem 0', sm: '2rem 2rem' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <Typography
        sx={{ margin: '0', textAlign: 'center' }}
        fontSize={{ xs: '1.5rem', md: '2rem' }}
      >
        {' '}
        Admin Login
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormControl>
          <TextField
            margin="normal"
            required
            id="username"
            label="Username"
            name="username"
            value={inputs.username}
            autoComplete="username"
            autoFocus
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="password" required>
            Password
          </InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            label="Password"
            autoComplete="current-password"
            required
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
                  {inputs.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Box gap="1rem" display="flex" flexDirection='column' alignItems="flex-end">
          <LoadingButton
            fullWidth
            color="primary"
            variant="contained"
            style={{ margin: '0.5rem 0', width: '10rem' }}
            onClick={(e) => handleSubmit(e)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            disabled={!validateForm() || state.loading}
            loading={state.loading}
          >
            Sign In
          </LoadingButton>
          <Link to="/login">Not an admin? Sign In</Link>

        </Box>
      </Box>
      {state.success && <CustomSuccessTemplate message={state.message} />}
      {state.error && <CustomErrorTemplate message={state.message} />}
    </Box>
  );
};

export default AdminLogin;
