import { Check, ContentCopy, Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
import { generateNewCodeApi, getOrgDetails } from '../../../api/adminApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';

const MyOrganization = () => {
  const [state, setState] = useState({
    name: ' ',
    email: ' ',
    inviteCode: ' ',
    apiKey: 'XYZ',
    error: false,
    success: false,
    errorMessage: '',
    successMessage: '',
    loading: false,
    dataFetchLoading: false,
    dataFetchMessage: '',
  });

  const user = useSelector(currentUser);
  const org = {
    organizationName: user.organizationName,
    organizationId: user.organizationId,
    userType: 'admin',
  };
  const [qrImage, setQrImage] = useState('');
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  const [inviteUrlCopied, setInviteUrlCopied] = useState(false);
  const copyText = (url) => {
    if (url) {
      navigator.clipboard.writeText(
        process.env.REACT_APP_REGISTER_URL + state.inviteCode
      );
      setInviteUrlCopied(true);
      setTimeout(() => {
        setInviteUrlCopied(false);
      }, 3000);
    } else {
      navigator.clipboard.writeText(state.inviteCode);
      setInviteCodeCopied(true);
      setTimeout(() => {
        setInviteCodeCopied(false);
      }, 3000);
    }
  };
  const handleNewInviteCode = async () => {
    setState({
      ...state,
      loading: true,
    });
    try {
      const res = await generateNewCodeApi(
        {
          organizationId: org.organizationId,
        },
        { headers: { Authorization: user.token } }
      );
      res && getOrgDetailsFunction();
      setState({
        ...state,
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const generateQR = async () => {
    try {
      const res = await QRCode.toDataURL(
        process.env.REACT_APP_REGISTER_URL + state.inviteCode
      );
      setQrImage(res);
      // const QRDataURI = await QRCode.toBuffer(
      //   `${baseURL}/register?code=${inviteCode}`,
      //   {}
      // );
    } catch (err) {
      console.error(err);
    }
  };

  const getOrgDetailsFunction = async () => {
    setState({
      ...state,
      dataFetchLoading: true,
      success: false,
      dataFetchMessage: '',
    });
    try {
      const res = await getOrgDetails(org);
      setState({
        ...state,
        dataFetchLoading: false,
        name: res.data.organizations.name,
        email: res.data.organizations.email,
        inviteCode: res.data.organizations.inviteCode,
        apiKey: res.data.organizations.apiKey,
        organizationCode: res.data.organizations.organizationCode,
      });
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        dataFetchLoading: false,
        error: true,
        dataFetchMessage: e.response.data.message,
      });
      setTimeout(() => {
        setState({
          ...state,
          dataFetchLoading: false,
          error: false,
          dataFetchMessage: '',
        });
      }, 3000);
    }
  };
  useEffect(() => {
    state.inviteCode !== '' && generateQR(state.inviteCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inviteCode]);
  useEffect(() => {
    getOrgDetailsFunction();
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
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
            mt: 1,
          }}
        >
          <Typography variant='h3'>My Organization</Typography>
        </Box>
        {state.dataFetchLoading ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pt: '2rem',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TextField
              type='text'
              id='name'
              name='name'
              value={state.name}
              label={'Organization Name'}
              onChange={handleChange}
              sx={{ width: '50%' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              type='text'
              id='name'
              name='name'
              value={state.email}
              label={'Organization Email'}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: '50%' }}
            />
            <Box
              sx={{
                display: 'flex',
                gap: '0.25rem',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}
              >
                <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
                  <InputLabel htmlFor='outlined-adornment-invite'>
                    Invite Code
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-invite'
                    style={{ margin: 'normal' }}
                    type='text'
                    name='name'
                    value={state.inviteCode}
                    readOnly
                    label='Invite Code'
                    endAdornment={
                      <InputAdornment position='end'>
                        {!inviteCodeCopied ? (
                          <IconButton
                            onClick={() => copyText(false)}
                            edge='end'
                          >
                            <ContentCopy />
                          </IconButton>
                        ) : (
                          <Check color='success' />
                        )}
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <LoadingButton
                  variant='contained'
                  sx={{ height: 'fit-content' }}
                  loading={state.loading}
                  disabled={state.loading}
                  onClick={handleNewInviteCode}
                >
                  Generate New
                </LoadingButton>
              </Box>
              <FormControl sx={{ m: 1, width: '32rem' }} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-invite'>
                  Invite URL
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-invite'
                  style={{ margin: 'normal' }}
                  type='text'
                  name='name'
                  value={process.env.REACT_APP_REGISTER_URL + state.inviteCode}
                  readOnly
                  label='Invite URL'
                  endAdornment={
                    <InputAdornment position='end'>
                      {!inviteUrlCopied ? (
                        <IconButton onClick={() => copyText(true)} edge='end'>
                          <ContentCopy />
                        </IconButton>
                      ) : (
                        <Check color='success' />
                      )}
                    </InputAdornment>
                  }
                />
              </FormControl>
              {qrImage && (
                <Box
                  sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                >
                  {' '}
                  <img
                    src={qrImage}
                    alt='invite code'
                    style={{ width: '10rem' }}
                  />
                  <a href={qrImage} download style={{ textDecoration: 'none' }}>
                    <Button variant='text' startIcon={<Download />}>
                      {' '}
                      Download
                    </Button>
                  </a>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <TextField
                margin='normal'
                type='text'
                id='name'
                name='name'
                value={state.apiKey}
                label={'API Key'}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '24rem' }}
              />
              <LoadingButton
                variant='contained'
                sx={{ height: 'fit-content' }}
                loading={state.loading}
              >
                Generate New
              </LoadingButton>
            </Box>
            <Box sx={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <TextField
                margin='normal'
                type='text'
                id='name'
                name='name'
                value={state.organizationCode}
                label={'Organization API Code'}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
              <LoadingButton
                variant='contained'
                sx={{ height: 'fit-content' }}
                loading={state.loading}
              >
                Generate New
              </LoadingButton>
            </Box>
          </Box>
        )}
      </Box>
      {state.error && <CustomErrorTemplate message={state.errorMessage} />}
    </Container>
  );
};

export default MyOrganization;
