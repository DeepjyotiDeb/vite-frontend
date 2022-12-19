/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import './App.css';

import { currentUser } from './features/auth/userSlice';
import { Router } from './router/Router';
import theme from './styles/theme';

function App() {
  const { i18n } = useTranslation();
  const user = useSelector(currentUser);

  useEffect(() => {
    // if (user?.language === 'English') {
    //   i18n.changeLanguage('Hindi');
    // } else i18n.changeLanguage('English');
      if(window.location.pathname!=='/admin'){
        i18n.changeLanguage(user?.language || localStorage.getItem('authLanguage') || 'English');
      }
      else{
        i18n.changeLanguage('English');
      }
  }, [user?.language]);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Router />
      </Box>
    </ThemeProvider>
  );
}

export default App;
