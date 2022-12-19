import { ChevronRight } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { styled } from '@mui/styles';
import React from 'react';

const CustomButton = ({ buttonText }) => {
  return (
    <div>
      <button className='button'>
        <div className='inner'>
          <div className='text'>
            <span>{buttonText}</span>
            <span></span>
          </div>
          <div className='icon'>
            <ChevronRight />
          </div>
        </div>
      </button>
    </div>
  );
};

export const CustomIconButton = styled(Button)(() => ({
  mx: 3,
  my: 3,
  fontSize: 14,
  borderRadius: 2,
  textTransform: 'none',
  backgroundColor: '#0d47a1',
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: '#1a237e',
    },
  },
}));

export const CustomIconLabelButton = ({ children, ...props }) => {
  return (
    <IconButton
      sx={{
        fontSize: 14,
        lineHeight: '20px',
        textTransform: 'none',
        borderRadius: 2,
        mx: 1,
        my: 3,
        p: 2,
        backgroundColor: '#0d47a1',
        color: 'white',
        flexDirection: 'column',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: '#1a237e',
          },
        },
        ...props.sx,
      }}
      {...props}>
      {children}
    </IconButton>
  );
};

export default CustomButton;
