import { FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleSignupClick = () => {
    navigate('/register');
  };
  const [language, setLanguage] =  useState(localStorage.getItem('authLanguage') || 'English');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{navigate('/login')},[])
  return (
    <Box
      sx={{
        height: '100%',
        paddingTop: 24,
        paddingX: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
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
      localStorage.setItem('authLanguage', event.target.value)
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
      <Typography
        variant='h2'
        component='div'
        gutterBottom
        sx={{ textAlign: 'center' }}
      >
        Smart Paper
      </Typography>
      <Typography
        variant='h3'
        component='div'
        gutterBottom
        sx={{ textAlign: 'center' }}
      >
        {t('connectingPaperDigital')}
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        mt={1}
      >
        <Grid item>
          {' '}
          <Button
            variant='contained'
            onClick={() => handleLoginClick()}
            sx={{ width: '15rem', padding: '0.75rem 0', fontSize: '1rem' }}
          >
            {t('signIn')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={() => handleSignupClick()}
            sx={{ width: '15rem', padding: '0.75rem 0', fontSize: '1rem' }}
          >
            {t('signUp')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
