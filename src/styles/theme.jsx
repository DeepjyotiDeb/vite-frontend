import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#3366fc',
    },
    secondary: {
      main: '#01204A',
    },
    external: {
      main: '#2580e8',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#000',
    },
    link: {
      primary: '#3366fc',
    },
  },
  /* typography: {
    // "fontFamily": `"Roboto Slab", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    padding: 0,
  },
  overrides: {
    MuiTypography: {
      body1: {
        // "fontFamily": `"Roboto Slab","Helvetica", "Arial", sans-serif`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
      },
      body2: {},
    },
  }, */
});
// const theme = createTheme();

theme.typography.h3 = {
  fontSize: '1.5rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};
theme.typography.h2 = {
  fontSize: '1.8rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.4rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.8rem',
  },
};

export default theme;
