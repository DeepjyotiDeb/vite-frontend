import { styled } from '@mui/system';

const CustomFileInput = styled('input')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
  border: '1px solid #ccc',
  fontSize: 14,
  borderRadius: '8px',
  width: '354px',
  padding: '15px 20px',
  margin: '8px 0 15px 0',
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow'
  ]),
  fontFamily: [
    'Open Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:focus': {
    boxShadow: `#005fcc 0 0 0 0.1rem`,
    borderColor: '#005fcc'
  }
}));

const CustomSelect = styled('select')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
  border: '1px solid #ccc',
  fontSize: 14,
  borderRadius: '8px',
  width: '100%',
  padding: '15px 20px',
  margin: '8px 0 15px 0',
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow'
  ]),
  fontFamily: [
    'Open Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:focus': {
    boxShadow: `#005fcc 0 0 0 0.1rem`,
    borderColor: '#005fcc'
  }
}));

export { CustomFileInput, CustomSelect };
