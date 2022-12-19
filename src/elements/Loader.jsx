import { keyframes } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

const color = keyframes`
  100%,
  0% {
    stroke: #d62d20;
  }

  40% {
    stroke: #0057e7;
  }

  66% {
    stroke: #008744;
  }

  80%,
  90% {
    stroke: #ffa700;
  }
`;
const Loader = ({ loadingMessage, sx, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: { xs: 0, sm: '200px', md: '200px' },
        right: 0,
        padding: '20% 20% 0 20%',
        zIndex: 101,
        height: '100vh',
        // minHeight: '100vh',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Fade in={true} unmountOnExit>
        <CircularProgress
          variant='indeterminate'
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
            animationDuration: '550ms',
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
              animation: ` ${color} 4s ease-in-out infinite`,
            },
            position: 'relative',
            margin: '5em auto 2em auto',
            height: '100px',
            width: '100px',
            '&::before': {
              content: '""',
              display: 'block',
            },
          }}
          thickness={3}
          {...props}
        />
      </Fade>
      <Typography
        variant='caption'
        component='span'
        sx={{
          position: 'relative',
          color: '#000000',
          fontWeight: 'bold',
          fontFamily: 'Open Sans',
          fontSize: '16px',
        }}
      >
        {loadingMessage}
      </Typography>
    </Box>
  );
};

export default Loader;
