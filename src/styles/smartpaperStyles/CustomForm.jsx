import { Button, InputBase, InputLabel, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomInput = styled(InputBase)(({ theme }) => ({
  ...theme.typography.body2,
  'label + &': {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    fontSize: 12
  },
  '& .MuiInputBase-input': {
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ccc',
    fontSize: 14,
    borderRadius: '8px',
    width: '100%',
    paddingTop: '15px',
    paddingRight: '20px',
    paddingBottom: '15px',
    paddingLeft: '20px',
    margin: '0',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow'
    ]),
    // Use the system font instead of the default Roboto font.
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
    },
    '&:active': {
      boxShadow: `#005fcc 0 0 0 0.1rem`,
      borderColor: '#005fcc'
    }
  }
}));

const CustomLabel = ({ id, children, required, ...props }) => {
  return (
    <InputLabel
      sx={{
        fontSize: 12,
        color: '#000000',
        fontWeight: 'bold',
        // fontFamily: 'Open Sans',
        margin: 'auto 8px 0px auto',
        padding: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...props.sx
      }}
      id={id}
    >
      {children}
      {required ? <span sx={{ fontWeight: 'light' }}> *</span> : ''}
    </InputLabel>
  );
};

const CustomButton = styled(Button)(() => ({
  marginTop: 3,
  fontSize: 14,
  borderRadius: 4,
  textTransform: 'none',
  backgroundColor: '#0d47a1',
  // '&:hover': {
  //   backgroundColor: '#1a237e'
  // },
  '@media (hover: hover)': {
    '&:hover': {
        backgroundColor: '#1a237e',
    }
}
}));

const Input = styled('input')({
  display: 'none'
});
const OutlinedButton = styled(Button)(() => ({
  marginTop: 3,
  fontSize: 14,
  borderRadius: 4,
  border: '2px solid #0d47a1',
  textTransform: 'none',
  borderColor: '#0d47a1',
  color: '#0d47a1',
  transition: 'all 0.5s',
  '&:hover': {
    boxShadow: `0 0 3px #1a237e inset`,
    border: '2px solid #1a237e'
  }
}));

const CustomTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    borderRadius: '8px',
    width: '100%',
    margin: '0',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
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
    },
    '&:active': {
      boxShadow: `#005fcc 0 0 0 0.1rem`,
      borderColor: '#005fcc'
    }
  },
}));

export { CustomButton, CustomInput, CustomLabel, CustomTextField, Input, OutlinedButton };
